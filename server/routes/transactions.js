import express from 'express';
const router = express.Router();
import { auth, checkRole } from '../middleware/auth.js';
import Transaction from '../models/Transaction.js';
import mongoose from'mongoose';

router.get('/my-transactions', auth, async (req, res) => {
  try {
    const { type } = req.query; 
    const filter = type ? { transactionType: type } : {};
    const transactions = await Transaction.find(filter)
      .populate('loan', 'amount interestRate')
      .populate('from', 'firstName lastName')
      .populate('to', 'firstName lastName')
      .sort('-createdAt');

    res.json(transactions);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get("/analytics", auth, async (req, res) => {
  try {

    console.log("User ID:", req.user.userId);

    const userId = new mongoose.Types.ObjectId(req.user.userId);

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

   
    const investments = await Transaction.aggregate([
      { $match: { from: userId, type: 'investment' } },
      { $group: { _id: { $month: "$createdAt" }, totalAmount: { $sum: "$amount" } } },
      { $sort: { _id: 1 } }
    ]);

  
    console.log("Investments:", investments);


    const repayments = await Transaction.aggregate([
      { 
        $match: { 
          $or: [{ from: userId }, { to: userId }], 
          type: 'repayment' 
        } 
      },
      { $group: { _id: { $month: "$createdAt" }, totalAmount: { $sum: "$amount" } } },
      { $sort: { _id: 1 } }
    ]);

  
    console.log("Repayments:", repayments);

    res.json({ investments, repayments });
  } catch (error) {
    console.error("Error fetching analytics:", error);
    res.status(500).json({ message: "Server error" });
  }
});

 


export default router; 