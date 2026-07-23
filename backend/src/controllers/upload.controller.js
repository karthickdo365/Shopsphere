const fs = require("fs");
const cloudinary = require("../config/cloudinary");

// POST /api/v1/upload (Admin)
const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No image file provided",
      });
    }

    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "shopsphere",
    });

    // Delete local temporary file
    fs.unlinkSync(req.file.path);

    return res.status(201).json({
      success: true,
      url: result.secure_url,
    });
  } catch (error) {
    console.error(error);

    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    return res.status(500).json({
      success: false,
      message: "Image upload failed",
    });
  }
};

// POST /api/v1/upload/multiple (Admin)
const uploadImages = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No image files provided",
      });
    }

    const urls = [];

    for (const file of req.files) {
      const result = await cloudinary.uploader.upload(file.path, {
        folder: "shopsphere/products",
      });

      urls.push(result.secure_url);

      // Delete local temporary file
      fs.unlinkSync(file.path);
    }

    return res.status(201).json({
      success: true,
      urls,
    });
  } catch (error) {
    console.error(error);

    if (req.files) {
      req.files.forEach((file) => {
        if (fs.existsSync(file.path)) {
          fs.unlinkSync(file.path);
        }
      });
    }

    return res.status(500).json({
      success: false,
      message: "Image upload failed",
    });
  }
};

module.exports = {
  uploadImage,
  uploadImages,
};