import express from 'express';
const router = express.Router();
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { auth } from '../middleware/auth.js';
import User from '../models/User.js';

router.get('/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/profile', auth, async (req, res) => {
  try {
    const { firstName, lastName } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user.userId,
      { firstName, lastName },
      { new: true }
    ).select('-password');

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({ user, token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/change-password', auth, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user.userId);

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    res.json({ message: 'Password updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});


// router.delete('/:id/delete', auth, async (req, res) => {
//   try {
//     const userToDelete = await User.findById(req.params.id);
//     if (!userToDelete) {
//       return res.status(404).json({ message: 'User not found' });
//     }

//     if (req.user.role !== 'admin' && req.user.userId !== req.params.id) {
//       return res.status(403).json({ message: 'Not authorized to delete this user' });
//     }

//     await User.findByIdAndDelete(req.params.id);

//     res.json({ message: 'User deleted successfully' });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: 'Server error' });
//   }
// });


export default router;