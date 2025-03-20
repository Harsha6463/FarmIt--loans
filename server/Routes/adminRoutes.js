
import express from 'express';
import { auth, checkRole } from '../middleware/auth.js';
import AdminController from '../Controllers/adminContriller.js'

const router= express.Router()

router.get('/users', [auth, checkRole(['admin'])], AdminController.getUsers);
router.put('/users/:id/verify', [auth, checkRole(['admin'])], AdminController.verifyUser);
router.get('/documents', [auth, checkRole(['admin'])], AdminController.getDocuments);
router.put('/documents/:id/verify', [auth, checkRole(['admin'])], AdminController.verifyDocument);
router.get('/loans', [auth, checkRole(['admin'])], AdminController.getLoans);
router.get('/farms', [auth, checkRole(['admin'])], AdminController.getFarms);
router.get('/:id/investments', [auth, checkRole(['admin'])], AdminController.getInvestments);
router.get('/my-transactions', [auth, checkRole(['admin'])], AdminController.getMyTransactions);
router.delete('/deleteUser/:id', [auth, checkRole(['admin'])], AdminController.deleteUser);

export default router;