
import express from 'express';
const router= express.Router()
import AuthController, { upload } from "../Controllers/authController.js"

router.post("/register", upload.single("profilePic"), AuthController.register);
router.post("/login", AuthController.login);

export default router;