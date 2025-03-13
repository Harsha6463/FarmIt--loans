import express from "express";
const router = express.Router();
import { auth, checkRole } from "../middleware/auth.js";
import Loan from "../models/Loan.js";
import Farm from "../models/Farm.js";
import Transaction from "../models/Transaction.js";

router.get("/my-loans", auth, async (req, res) => {
  try {
    const loans = await Loan.find()
      .populate("farm")
      .populate("investors.investor");

    res.json(loans);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});



router.get(
  "/my-investments",
  [auth, checkRole(["investor"])],
  async (req, res) => {
    try {
      const loans = await Loan.find({ "investors.investor": req.user.userId })
        .populate("farm")
        .populate("investors.investor");
      res.json(loans);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  }
);

router.get("/available", [auth, checkRole(["investor"])], async (req, res) => {
  try {
    const loans = await Loan.find({ status: "pending" })
      .populate("farm")
      .populate("investors.investor");
    res.json({ loans, investorId: req.user.userId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});



router.post("/", [auth, checkRole(["farmer"])], async (req, res) => {
  try {
    const { farmId, amount, interestRate, duration } = req.body;

    const farm = await Farm.findOne({ _id: farmId, farmer: req.user.userId });
    if (!farm) {
      return res.status(404).json({ message: "Farm not found" });
    }

    const loan = new Loan({
      farm: farmId,
      amount,
      interestRate,
      duration,
      repaymentSchedule: generateRepaymentSchedule(
        amount,
        interestRate,
        duration
      ),
    });

    await loan.save();
    res.json(loan);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

router.post(
  "/:id/invest",
  [auth, checkRole(["investor"])],
  async (req, res) => {
    try {
      const { amount, fromUserId, toUserId } = req.body;
      const loan = await Loan.findById(req.params.id);

      const transaction = new Transaction({
        type: "investment",
        amount: amount,
        loan: loan,
        from: fromUserId,
        to: toUserId,
      });
      await transaction.save();
      if (!loan) {
        return res.status(404).json({ message: "Loan not found" });
      }

      if (loan.status !== "pending") {
        return res
          .status(400)
          .json({ message: "Loan is not available for investment" });
      }

      const totalInvested =
        loan.investors.reduce((sum, inv) => sum + inv.amount, 0) + amount;
      if (totalInvested > loan.amount) {
        return res
          .status(400)
          .json({ message: "Investment amount exceeds loan requirement" });
      }

      loan.investors.push({
        investor: req.user.userId,
        amount,
      });

      if (totalInvested === loan.amount) {
        loan.status = "pending";
      }

      await loan.save();
      res.json({
        message: "Investment successful and transaction recorded",
        loan,
        transaction,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  }
);



router.post("/:id/repay", [auth, checkRole(["farmer"])], async (req, res) => {
  try {
    const { amount, toUserId } = req.body;
    console.log(req.user)
 const fromUserId=req.user.userId
    const loan = await Loan.findById(req.params.id).populate("farm");
    console.log(loan)
    const transaction = new Transaction({
      type: "repayment",
      amount: amount,
      loan: loan._id,
      from: fromUserId,
      to: toUserId,
    });
console.log(transaction)
    await transaction.save();

    if (!loan) {
      return res.status(404).json({ message: "Loan not found" });
    }

   

    const unpaidPayment = loan.repaymentSchedule.find( 
      (p) => p.status === "pending"
    );
    if (!unpaidPayment) {
      return res.status(400).json({ message: "No pending payments found" });
    }


    if (amount !== unpaidPayment.amount) {
      return res
        .status(400)
        .json({ message: "Payment amount must match the scheduled amount" });
    }

    unpaidPayment.status = "paid";

    const allPaid = loan.repaymentSchedule.every((p) => p.status === "paid");
    if (allPaid) {
      loan.status = "completed";
    }


    console.log(allPaid)

    await loan.save();

    res.json({
      message: "Repayment successful and transaction recorded",
      loan,
      transaction,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});




router.get("/:id/schedule", auth, async (req, res) => {
  try {
    const loan = await Loan.findById(req.params.id).populate("farm");

    if (!loan) {
      return res.status(404).json({ message: "Loan not found" });
    }

    const isAuthorized =
      loan.farm.farmer.toString() === req.user.userId ||
      loan.investors.some((inv) => inv.investor.toString() === req.user.userId);

    if (!isAuthorized) {
      return res.status(403).json({ message: "Not authorized" });
    }

    res.json(loan.repaymentSchedule);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});


router.get("/pending-investments", [auth, checkRole(["admin"])], async (req, res) => {
  try {
    const loans = await Loan.find({ "status": ["pending" ,"verified"]})
      .populate({
        path: "investors.investor",
        select: "name email",
      })
      .populate("farm", "name location");

    res.status(200).json(loans);
  } catch (error) {
    console.error("Error fetching pending investments:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Verify Investment
router.post("/verify-investment", [auth, checkRole(["admin"])], async (req, res) => {
  try {
    const { loanId, investorId } = req.body;
    const loan = await Loan.findById(loanId);
    if (!loan) return res.status(404).json({ message: "Loan not found" });


    console.log(investorId)
    const investor = loan.investors.find(inv => inv.investor.toString() === investorId._id);
    console.log(investor)
    if (!investor) return res.status(404).json({ message: "Investor not found" });

    if (loan.status !== "pending") {
      return res.status(400).json({ message: "Investment already processed" });
    }

    loan.status = "verified";
    await loan.save();

    res.status(200).json({ message: "Investment verified successfully." });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Credit Investment
router.post("/credit-investment", [auth, checkRole(["admin"])], async (req, res) => {
  try {
    const { loanId, investorId } = req.body;

    const loan = await Loan.findById(loanId).populate("farm");
    if (!loan) return res.status(404).json({ message: "Loan not found" });

    const investor = loan.investors.find(inv => inv.investor.toString() === investorId._id);
    if (!investor) return res.status(404).json({ message: "Investor not found" });

    if (loan.status !== "verified") {
      return res.status(400).json({ message: "Investment must be verified before crediting" });
    }

    if (investor.status === "credited") {
      return res.status(400).json({ message: "Investment has already been credited" });
    }

    loan.status = "credited";

    const repaymentSchedule = generateRepaymentSchedule(loan.amount);

    loan.repaymentSchedule = repaymentSchedule;

    await Transaction.create({
      loan: loan._id,
      from: investor.investor,
      to: loan.farm.farmer,
      amount: investor.amount,
      type: "investment",
      date: new Date(),
    });

    await loan.save();

    res.status(200).json({ message: "Investment credited successfully and repayment schedule generated." });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

function generateRepaymentSchedule(amount) {
  const schedule = [];
  const repaymentAmount = amount / 10;
  for (let i = 1; i <= 10; i++) {
    const dueDate = new Date();
    dueDate.setMonth(dueDate.getMonth() + i);

    schedule.push({
      dueDate: dueDate,
      amount: repaymentAmount,
      status: "pending",
    });
  }
  return schedule;
}


export default router;