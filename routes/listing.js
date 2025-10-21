const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const Listing = require("../models/listing.js");
const listingController = require("../controllers/listings.js");

const multer = require("multer");
const { storage, cloudinary } = require("../cloudConfig.js");
const upload = multer({ 
  storage,
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB limit
    fieldSize: 100 * 1024 * 1024, // 100MB for other fields
  },
  fileFilter: (req, file, cb) => {
    // Check file type
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

// Error handling middleware for multer
const handleMulterError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      req.flash('error', 'File size too large. Maximum allowed size is 100MB.');
      return res.redirect('/listings/new');
    }
  } else if (err.message === 'Only image files are allowed!') {
    req.flash('error', 'Only image files are allowed!');
    return res.redirect('/listings/new');
  }
  next(err);
};




router
  .route("/")
  .get(
    wrapAsync(listingController.index)
  )
 
  .post(isLoggedIn, upload.single("listing[image][url]"), handleMulterError, validateListing, wrapAsync(listingController.createListing));


  //new route
router.get("/new", isLoggedIn, listingController.renderNewForm);

// Filter route
router.get("/filter/:category", wrapAsync(listingController.filterByCategory));

// Wishlist routes
router.post("/:id/like", isLoggedIn, wrapAsync(listingController.toggleLike));
router.get("/wishlist", isLoggedIn, wrapAsync(listingController.wishlist));


router.route("/:id")
  .get(

    wrapAsync(listingController.showListing)
  )
  .put(

    isLoggedIn,
    isOwner,
    upload.single("listing[image][url]"),
    handleMulterError,
    validateListing,
    wrapAsync(listingController.updateListing)
  )
  .delete(

    isLoggedIn,
    isOwner,
    wrapAsync(listingController.deleteListing)
  );



//Edit Route
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.renderEditForm)
);




module.exports = router;