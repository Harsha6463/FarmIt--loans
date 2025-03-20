import express from 'express';

import { auth } from "../middleware/auth.js";
import LoanController from '../Controllers/LoanControllers.js';
const router = express.Router();

router.post('/create', auth, LoanController.createLoan);
router.get('/my-loans', auth, LoanController.getMyLoans);
router.post('/:id/repay', auth, LoanController.repayLoan);
router.get('/:id/repayment-schedule', auth, LoanController.getRepaymentSchedule);

router.get('/my-investments', auth, LoanController.getMyInvestments);
router.get('/available-loans', auth, LoanController.getAvailableLoans);
router.post('/:id/invest', auth, LoanController.investInLoan);

export default router;
