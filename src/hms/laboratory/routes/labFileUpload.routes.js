import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";

const router = express.Router();

// Storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = "uploads/lab-results";
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, `lab_${uniqueSuffix}${ext}`);
  },
});

const upload = multer({ storage });

// ✅ Upload route
router.post("/upload", upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  const fileUrl = `${req.file.path}`;
  res.json({
    message: "File uploaded successfully",
    fileUrl,
  });
});

export default router;
