import express from "express";
const router = express.Router();

import IssueController from "../Controllers/issuesController.js"
import { auth, checkRole } from "../middleware/auth.js";
router.post(
  "/add-issue",
  [auth, checkRole(["farmer", "investor"])],
  IssueController.addIssue
);

router.get(
  "/all-issues",
  [auth, checkRole(["farmer", "investor", "admin"])],
  IssueController.getAllIssues
);

router.get(
  "/user-issues",
  [auth, checkRole(["farmer", "investor"])],
  IssueController.getUserIssues
);

export default router;
