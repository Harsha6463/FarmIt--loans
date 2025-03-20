import express from "express";
const router = express.Router();


import DocumentController from '../Controllers/documentsController.js';

import { auth,  } from '../middleware/auth.js';
import { upload } from "../Controllers/authController.js";
router.post("/upload", [auth, upload.single("file")], DocumentController.uploadDocument);
router.get("/my-documents", auth, DocumentController.getMyDocuments);
router.delete("/:id", auth, DocumentController.deleteDocument);
router.get("/download/:id", auth, DocumentController.downloadDocument);

export default router;
