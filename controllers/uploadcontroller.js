const path = require("path");

const uploadfile = (req, res) => {

  try {

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    res.json({
      fileUrl: `http://localhost:4000/uploads/${req.file.filename}`,
      fileType: req.file.mimetype
    });

  } catch (err) {
    console.log("Upload error:", err);
    res.status(500).json({ message: "Upload failed" });
  }

};

module.exports = {
  uploadfile
};
