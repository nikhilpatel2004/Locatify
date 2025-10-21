const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

cloudinary.config({
  cloud_name:process.env.CLOUD_NAME,
  api_key:process.env.CLOUD_API_KEY,
  api_secret:process.env.CLOUD_API_SECRET,  
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "WanderLust_DEV",
    allowedFormats: ["jpg", "png", "jpeg"],
    transformation: [
      { width: 800, height: 600, crop: "fill", quality: "auto" },
      { fetch_format: "auto" }
    ],
    resource_type: "image",
    chunk_size: 10000000, // 10MB chunks
  },
});

module.exports.storage = storage;
module.exports.cloudinary = cloudinary;