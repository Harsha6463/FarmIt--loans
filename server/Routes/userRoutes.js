import express from 'express';
import UserController from '../Controllers/usersController.js'; 
import { auth } from '../middleware/auth.js';

const router = express.Router();

router.get('/profile', auth, UserController.getProfile);
router.put('/profile', auth, UserController.updateProfile);
router.put('/change-password', auth, UserController.changePassword);

export default router;
