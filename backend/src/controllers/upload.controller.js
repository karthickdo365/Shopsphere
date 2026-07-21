// POST /api/v1/upload (Admin) - single image, form field name "image"
const uploadImage = (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'No image file provided' });
  }

  // Publicly reachable URL for the uploaded file, served by the /uploads static route
  const url = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;

  res.status(201).json({ success: true, url });
};

// POST /api/v1/upload/multiple (Admin) - multiple images, form field name "images"
const uploadImages = (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ success: false, message: 'No image files provided' });
  }

  const urls = req.files.map((file) => `${req.protocol}://${req.get('host')}/uploads/${file.filename}`);

  res.status(201).json({ success: true, urls });
};

module.exports = { uploadImage, uploadImages };
