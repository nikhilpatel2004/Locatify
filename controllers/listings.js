const Listing = require("../models/listing.js");
const NodeGeocoder = require('node-geocoder');
const User = require("../models/user.js");

const options = { // Switch to a free provider
  provider: 'openstreetmap',
};
const geocoder = NodeGeocoder(options);

/**
 * A helper function to process listings: calculate average rating and check if liked by the user.
 * @param {Array} listings - An array of Mongoose listing documents.
 * @param {Object} user - The currently logged-in user object.
 * @returns {Array} An array of processed plain JavaScript listing objects.
 */
const processListings = (listings, user) => {
    const likedIds = user?.favorites?.map(id => String(id)) || [];
    
    return listings.map(listing => {
        const listingObj = listing.toObject();
        
        if (listingObj.reviews && listingObj.reviews.length > 0) {
            const totalRating = listingObj.reviews.reduce((sum, review) => sum + review.rating, 0);
            listingObj.averageRating = Math.round((totalRating / listingObj.reviews.length) * 10) / 10;
            listingObj.reviewCount = listingObj.reviews.length;
        } else {
            listingObj.averageRating = 0;
            listingObj.reviewCount = 0;
        }
        listingObj.isLiked = likedIds.includes(String(listingObj._id));
        return listingObj;
    });
};

module.exports.index = async (req, res) => {
    const { search } = req.query;
    let allListings;
    
    if (search) {
        // Search in title, description, location, and country
        allListings = await Listing.find({
            $or: [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
                { location: { $regex: search, $options: 'i' } },
                { country: { $regex: search, $options: 'i' } }
            ]
        }).populate('reviews');
    } else {
        allListings = await Listing.find({}).populate('reviews');
    }
    
    allListings = processListings(allListings, req.user);
    res.render("./listings/index.ejs", { allListings, searchQuery: search });
};

module.exports.filterByCategory = async (req, res) => {
    const { category } = req.params;
    let allListings;
    
    // Define filter criteria based on category
    const filterCriteria = {
        'trending': { price: { $gte: 2000 } }, // High-priced listings
        'rooms': { title: { $regex: /apartment|room|studio/i } },
        'iconic-cities': { 
            $or: [
                { location: { $regex: /mumbai|delhi|bangalore|goa/i } },
                { country: { $regex: /india/i } }
            ]
        },
        'mountains': { 
            $or: [
                { title: { $regex: /mountain|hill|peak/i } },
                { location: { $regex: /manali|himachal|kashmir/i } }
            ]
        },
        'castles': { title: { $regex: /castle|palace|haveli/i } },
        'amazing-pools': { title: { $regex: /pool|villa|resort/i } },
        'camping': { title: { $regex: /camp|cabin|lodge/i } },
        'farms': { title: { $regex: /farm|rural|countryside/i } },
        'arctic': { title: { $regex: /snow|winter|ski/i } },
        'domes': { title: { $regex: /dome|igloo|unique/i } },
        'boats': { title: { $regex: /boat|yacht|water/i } }
    };
    
    if (filterCriteria[category]) {
        allListings = await Listing.find(filterCriteria[category]).populate('reviews');
    } else {
        allListings = await Listing.find({}).populate('reviews');
    }
    
    allListings = processListings(allListings, req.user);
    res.render("./listings/index.ejs", { 
        allListings, 
        searchQuery: null,
        activeFilter: category 
    });
};

// Toggle like for a listing
module.exports.toggleLike = async (req, res) => {
    if (!req.user) {
        return res.status(401).json({ success: false, message: "Login required" });
    }
    const { id } = req.params;
    const user = await User.findById(req.user._id);
    const index = user.favorites.findIndex(fid => String(fid) === String(id));
    let liked;
    if (index >= 0) {
        user.favorites.splice(index, 1);
        liked = false;
    } else {
        user.favorites.push(id);
        liked = true;
    }
    await user.save();
    return res.json({ success: true, liked });
};

// Show wishlist page
module.exports.wishlist = async (req, res) => {
    if (!req.user) {
        req.flash("error", "You must be logged in to view wishlist");
        return res.redirect("/login");
    }
    const user = await User.findById(req.user._id).populate({
        path: "favorites",
        populate: { path: "reviews" }
    });
    let allListings = processListings(user.favorites || [], req.user);

    res.render("./listings/index.ejs", { allListings, searchQuery: null, activeFilter: "wishlist" });
};

module.exports.renderNewForm = (req, res) => {
    res.render("listings/new.ejs");
};

module.exports.showListing = async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id)
        .populate({ path: "reviews", populate: { path: "author" } })
        .populate("owner");
    if (!listing) {
        req.flash("error", "The listing you requested does not exist.");
        return res.redirect("/listings");
    }

    // **SOLUTION**: If a listing has no geometry, provide default coordinates for India.
    // This ensures the map on the show page always has data to render.
    if (!listing.geometry || !listing.geometry.coordinates || listing.geometry.coordinates.length === 0) {
        listing.geometry = {
            type: 'Point',
            coordinates: [78.9629, 20.5937] // Default coordinates (Center of India)
        };
    }

    res.render("listings/show.ejs", { listing });
};

module.exports.createListing = async (req, res, next) => {
    try {
        const { listing } = req.body;
        const locationQuery = listing?.location?.trim();

        // Image handling - use uploaded file or placeholder
        let url, filename;
        
        if (req.file) {
            url = req.file.path;
            filename = req.file.filename;
        } else {
            // Use placeholder image if no file uploaded
            url = 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1000&q=80';
            filename = 'placeholder';
        }

        const newListing = new Listing(listing);
        newListing.owner = req.user._id;
        newListing.image = { url, filename };

        // Geocode location. This is now a critical step.
        if (!locationQuery) {
            req.flash('error', 'Location is a required field.');
            return res.redirect('/listings/new');
        }

        const geoData = await geocoder.geocode(locationQuery);
        if (!geoData || geoData.length === 0) {
            req.flash('error', 'Could not find location. Please provide a more specific address.');
            return res.redirect('/listings/new');
        }

        newListing.geometry = {
            type: 'Point',
            coordinates: [geoData[0].longitude, geoData[0].latitude]
        };

        await newListing.save();
        req.flash("success", "Successfully made a new listing!");
        res.redirect("/listings");
    } catch (err) {
        console.error("CREATE LISTING ERROR:", err); // Log the full error for better debugging

        // More specific error messages
        let errorMessage = 'Something went wrong while creating the listing.';
        
        if (err.name === 'ValidationError') {
            const errors = Object.values(err.errors).map(e => e.message).join(', ');
            errorMessage = `Validation error: ${errors}`;
        } else if (err.code === 11000) {
            errorMessage = 'A listing with this title already exists.';
        } else if (err.name === 'CastError' && err.path === 'price') {
            errorMessage = 'Please enter a valid price (numbers only).';
        } else if (err.message.includes('geometry')) {
            // This will catch errors if geocoding fails and geometry is required
            errorMessage = 'Could not verify the location. Please check your API key or try a different address.';
        } else if (err.message.includes('required')) {
            errorMessage = `Please fill in all required fields. ${err.message}`;
        } else {
            // For any other errors, show a more generic but still helpful message
            errorMessage = `An unexpected error occurred: ${err.message}`;
        }
        
        req.flash('error', errorMessage);
        return res.redirect('/listings/new');
    }
};

module.exports.renderEditForm = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Listing not found!");
        return res.redirect("/listings");
    }
    let originalImageUrl = listing.image.url.replace("/upload", "/upload/w_250");
    res.render("listings/edit.ejs", { listing, originalImageUrl });
};

module.exports.updateListing = async (req, res) => {
    try {
        const { id } = req.params;
        const listing = await Listing.findById(id);
        if (!listing) {
            req.flash("error", "Listing not found!");
            return res.redirect("/listings");
        }

        const updateData = { ...req.body.listing };

        // Determine if geocoding is necessary: location string changed OR geometry is missing.
        const needsGeocoding = updateData.location && (listing.location !== updateData.location || !listing.geometry);

        if (needsGeocoding) {
            // Attempt to geocode the location from the form.
            const geoData = await geocoder.geocode(updateData.location);
            if (!geoData || geoData.length === 0) {
                req.flash('error', 'Could not update location. Please provide a more specific address.');
                return res.redirect(`/listings/${id}/edit`);
            }
            updateData.geometry = { type: 'Point', coordinates: [geoData[0].longitude, geoData[0].latitude] };
        }

        const updatedListing = await Listing.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });

        if (req.file) {
            updatedListing.image = { url: req.file.path, filename: req.file.filename };
            await updatedListing.save();
        }

        req.flash("success", "Successfully updated listing!");
        res.redirect(`/listings/${updatedListing._id}`);
    } catch (err) {
        console.error("UPDATE LISTING ERROR:", err); // Log the full error for debugging
        let errorMessage = 'Something went wrong while updating the listing.';
        if (err.name === 'ValidationError') {
            const errors = Object.values(err.errors).map(e => e.message).join(', ');
            errorMessage = `Update failed. Please check your inputs: ${errors}`;
        } else if (err.name === 'CastError') {
            errorMessage = `Invalid data format for field: ${err.path}.`;
        }
        req.flash('error', errorMessage);
        // Redirect back to the edit page so the user can fix the error
        res.redirect(`/listings/${req.params.id}/edit`);
    }
};

module.exports.deleteListing = async (req, res) => {
    let { id } = req.params;
    let deleteListing = await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted!");
    res.redirect("/listings");
};