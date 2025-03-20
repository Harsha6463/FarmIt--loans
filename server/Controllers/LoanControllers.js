import Loan from '../models/Loan.js';
import Farm from '../models/Farm.js';
import Transaction from '../models/Transaction.js';

const LoanController = {
  async createLoan(req, res) {
    try {
      const { farmId, amount, interestRate, duration } = req.body;
      const farm = await Farm.findOne({ _id: farmId, farmer: req.user.userId });
      if (!farm) return res.status(404).json({ message: "Farm not found" });

      const loan = new Loan({
        farm: farmId,
        amount,
        interestRate,
        duration,
        repaymentSchedule: this.generateRepaymentSchedule(amount, interestRate, duration),
      });

      await loan.save();
      res.json(loan);
    } catch (err) {
      res.status(500).json({ message: "Server error" });
    }
  },

  async getMyLoans(req, res) {
    try {
      const userFarms = await Farm.find({ farmer: req.user.userId }).select('_id');
      const farmIds = userFarms.map(farm => farm._id);
      const loans = await Loan.find({ farm: { $in: farmIds } })
        .populate('investors.investor')
        .populate('farm');
      res.json(loans);
    } catch (err) {
      res.status(500).json({ message: "Server error" });
    }
  },

  async repayLoan(req, res) {
    try {
      const { amount, toUserId } = req.body;
      const loan = await Loan.findById(req.params.id).populate("farm");
      const fromUserId = req.user.userId;
      const transaction = new Transaction({
        type: "repayment",
        amount: amount,
        loan: loan._id,
        from: fromUserId,
        to: toUserId,
      });

      await transaction.save();
      const unpaidPayment = loan.repaymentSchedule.find(p => p.status === "pending");
      if (!unpaidPayment) return res.status(400).json({ message: "No pending payments found" });

      if (amount !== unpaidPayment.amount) {
        return res.status(400).json({ message: "Payment amount must match the scheduled amount" });
      }

      unpaidPayment.status = "paid";
      const allPaid = loan.repaymentSchedule.every(p => p.status === "paid");
      if (allPaid) loan.status = "completed";

      await loan.save();
      res.json({ message: "Repayment successful", loan, transaction });
    } catch (err) {
      res.status(500).json({ message: "Server error" });
    }
  },

  async getRepaymentSchedule(req, res) {
    try {
      const loan = await Loan.findById(req.params.id).populate("farm");
      if (!loan) return res.status(404).json({ message: "Loan not found" });
      const isAuthorized = loan.farm.farmer.toString() === req.user.userId || loan.investors.some(inv => inv.investor.toString() === req.user.userId);
      if (!isAuthorized) return res.status(403).json({ message: "Not authorized" });
      res.json(loan.repaymentSchedule);
    } catch (err) {
      res.status(500).json({ message: "Server error" });
    }
  },

  async getMyInvestments(req, res) {
    try {
      const loans = await Loan.find({ "investors.investor": req.user.userId })
        .populate("farm")
        .populate("investors.investor");
      res.json(loans);
    } catch (err) {
      res.status(500).json({ message: "Server error" });
    }
  },

  async getAvailableLoans(req, res) {
    try {
      const loans = await Loan.find({ status: "pending" })
        .populate("farm")
        .populate("investors.investor");
      res.json({ loans, investorId: req.user.userId });
    } catch (err) {
      res.status(500).json({ message: "Server error" });
    }
  },

  async investInLoan(req, res) {
    try {
      const { amount, fromUserId } = req.body;
      const loan = await Loan.findById(req.params.id);
      if (!loan) return res.status(404).json({ message: "Loan not found" });
      if (loan.status !== "pending") return res.status(400).json({ message: "Loan is not available for investment" });

      const totalInvested = loan.investors.reduce((sum, inv) => sum + inv.amount, 0) + amount;
      if (totalInvested > loan.amount) return res.status(400).json({ message: "Investment exceeds loan amount" });

      loan.investors.push({ investor: fromUserId, amount });
      if (totalInvested === loan.amount) loan.status = "funded";
      await loan.save();
      res.json({ message: "Investment successful", loan });
    } catch (err) {
      res.status(500).json({ message: "Server error" });
    }
  },

  generateRepaymentSchedule(amount, interestRate, duration) {
    const schedule = [];
    const repaymentAmount = amount / 10;
    for (let i = 1; i <= 10; i++) {
      const dueDate = new Date();
      dueDate.setMonth(dueDate.getMonth() + i);
      schedule.push({ dueDate, amount: repaymentAmount, status: "pending" });
    }
    return schedule;
  },
};

export default LoanController;
