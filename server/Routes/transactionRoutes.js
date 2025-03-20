
import express from 'express';
import TransactionController from '../Controllers/transactionsController.js';
import { auth } from '../middleware/auth.js';
const router = express.Router();

router.get('/my-transactions', auth, TransactionController.getMyTransactions);
router.get("/analytics", auth, TransactionController.getAnalytics);

export default router;
