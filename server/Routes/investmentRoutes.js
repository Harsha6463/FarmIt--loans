import express from 'express';
import { auth, checkRole } from '../middleware/auth.js';
const router = express.Router()

import InvestmentController from "../Controllers/investmentsController.js"

router.get('/tracking', [auth, checkRole(['investor'])], InvestmentController.trackInvestments);
router.get('/:id', auth, InvestmentController.getInvestmentDetails);

export default router;
