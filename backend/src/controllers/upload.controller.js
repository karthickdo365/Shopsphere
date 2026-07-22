// POST /api/v1/upload (Admin)
const uploadImage = (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: "No image file provided" });
  }

  const baseUrl = process.env.BASE_URL;
  const url = `${baseUrl}/uploads/${req.file.filename}`;

  res.status(201).json({ success: true, url });
};

// POST /api/v1/upload/multiple (Admin)
const uploadImages = (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ success: false, message: "No image files provided" });
  }

  const baseUrl = process.env.BASE_URL;
  const urls = req.files.map(
    (file) => `${baseUrl}/uploads/${file.filename}`
  );

  res.status(201).json({ success: true, urls });
};

module.exports = { uploadImage, uploadImages };