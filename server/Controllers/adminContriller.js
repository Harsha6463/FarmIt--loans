import User from '../models/User.js';
import Farm from '../models/Farm.js';
import Loan from '../models/Loan.js';
import Transaction from '../models/Transaction.js';
import Document from '../models/Document.js';

const  AdminController = {
   async getUsers(req, res) {
    try {
      const users = await User.find().select('-password');
      res.json(users);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
    }
  },

   async verifyUser(req, res) {
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
  },

   async getDocuments(req, res) {
    try {
      const documents = await Document.find();
      res.json(documents);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
    }
  },
  async verifyDocument(req, res) {
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
  },

  async getLoans(req, res) {
    try {
      const loans = await Loan.find().populate('farm').populate('investors.investor');
      res.json(loans);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
    }
  },

   async getFarms(req, res) {
    try {
      const farms = await Farm.find().populate('farmer');
      res.json(farms);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
    }
  },

   async getInvestments(req, res) {
    try {
      const loans = await Transaction.findById({ farm: req.params.id })
        .populate('farm')
        .populate('investors.investor', '-password');
      
      if (!loans || loans.length === 0) {
        return res.status(404).json({ message: 'No loans found for this farm' });
      }

      const investmentsList = loans.map(loan => {
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

      res.json(investmentsList);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
    }
  },

   async getMyTransactions(req, res) {
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
  },

   async deleteUser(req, res) {
    try {
      const user = await User.findByIdAndDelete(req.params.id);
      if (!user) return res.status(404).json({ message: "User not found" });
      res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  }
}

export default AdminController
