import express from 'express';
const router = express.Router();
import { auth, checkRole } from '../middleware/auth.js';
import User from '../models/User.js';
import Farm from '../models/Farm.js';
import Loan from '../models/Loan.js';
import Transaction from '../models/Transaction.js';
import Document from '../models/Document.js';

router.get('/users', [auth, checkRole(['admin'])], async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/users/:id/verify', [auth, checkRole(['admin'])], async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isVerified: true },
      { new: true }
    ).select('-password');
    
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});
router.get('/documents', [auth, checkRole(['admin'])], async (req, res) => {
  try {
    const documents = await Document.find();
    res.json(documents);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/documents/:id/verify', [auth, checkRole(['admin'])], async (req, res) => {
  try {
    const document = await Document.findByIdAndUpdate(
      req.params.id,
      { isVerified: true },
      { new: true }
    );

    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }

    res.json(document);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});


router.get('/loans', [auth, checkRole(['admin'])], async (req, res) => {
  try {
    const loans = await Loan.find().populate('farm').populate('investors.investor');
    res.json(loans);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/farms', [auth, checkRole(['admin'])], async (req, res) => {
  try {
    const farms = await Farm.find().populate('farmer');
    res.json(farms);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});
router.get('/:id/investments', [auth, checkRole(['admin'])], async (req, res) => {
  try {
 console.log(loans)
    const loans = await Transaction.findById({ farm: req.params.id })
      .populate('farm')
      .populate('investors.investor', '-password'); 
console.log(loans)
    if (!loans || loans.length === 0) {
      return res.status(404).json({ message: 'No loans found for this farm' });
    }
    const investmentsList = Transaction.map(loan => {
      return {
        loanId: loan._id,
        farm: loan.farm.name,
        totalAmount: loan.amount,
        status: loan.status,
        investments: loan.investors.map(investment => ({
          investorId: investment.investor._id,
          investorName: investment.investor.name,
          investorEmail: investment.investor.email,
          amountInvested: investment.amount,
        }))
      };
    });
console.log(investmentsList)
    res.json(investmentsList);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});
router.get('/my-transactions', [auth, checkRole(['admin'])], async (req, res) => {
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

router.delete('/deleteUser/:id', [auth, checkRole(['admin'])], async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    
    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

export default router; 