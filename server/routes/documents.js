import express from "express";
const router = express.Router();
import multer from "multer";
import path from "path";
import { auth } from "../middleware/auth.js";
import Document from "../models/Document.js";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const storage = multer.diskStorage({
  destination: "./uploads/documents",
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 10000000 }, // 10MB limit
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
});

function checkFileType(file, cb) {
  const filetypes = /jpeg|jpg|png|pdf|doc|docx/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb("Error: Invalid file type!");
  }
}

router.post("/upload", [auth, upload.single("file")], async (req, res) => {
  try {
    const { title, type, relatedModel, relatedId } = req.body;

    const document = new Document({
      title,
      type,
      filePath: req.file.path,
      owner: req.user.userId,
      relatedTo: {
        model: relatedModel,
        id: relatedId,
      },
    });

    await document.save();
    res.json(document);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/my-documents", auth, async (req, res) => {
  try {
    const documents = await Document.find({ owner: req.user.userId }).sort(
      "-uploadedAt"
    );
    res.json(documents);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

router.delete("/:id", auth, async (req, res) => {
  try {
    const document = await Document.findOneAndDelete({
      _id: req.params.id,
      owner: req.user.userId,
    });

    if (!document) {
      return res.status(404).json({ message: "Document not found" });
    }

    res.json({ message: "Document deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/download/:id", auth, async (req, res) => {
  try {
    const document = await Document.findOne({
      _id: req.params.id,
      owner: req.user.userId,
    });

    if (!document) {
      return res.status(404).json({ message: "Document not found" });
    }

    res.download(
      path.join(__dirname, "../", document.filePath),
      document.title,
      (err) => {
        if (err) {
          console.error("Error while sending the file:", err);
          res
            .status(500)
            .json({ message: "Error while downloading the document" });
        }
      }
    );
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
