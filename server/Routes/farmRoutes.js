import express from 'express';
const router = express.Router();

import { auth, checkRole } from '../middleware/auth.js';  
import FarmController from '../Controllers/farmsController.js';
import { upload } from '../Controllers/authController.js';

router.get("/my-farms", auth, FarmController.getMyFarms);
router.post("/",
  [auth, checkRole(["farmer"]), upload.array("images", 5)],
  FarmController.createFarm
);
router.put("/:id", [auth, checkRole(["farmer"])], FarmController.updateFarm);

export default router;
