import { Router } from "express";
import {
  checkMonthlyPaymentStatus,
  getGroupPayments,
  getGroups,
  getUserContributionOverview,
  getUserPaymentHistory,
} from "../controllers/user.controller.js";
import limiter from "../middleware/limiter.js";
import verifyToken from "../middleware/verify.token.js";
import { requestLoan } from "../controllers/loan.controller.js";
import { editProfile } from "../controllers/edit.profile.controller.js";

const router = Router();

router.use("/", limiter);

router.get(
  "/group/:groupId/payment-status",
  verifyToken,
  checkMonthlyPaymentStatus
);

router.get("/group/:groupId/payments", verifyToken, getGroupPayments);

router.get("/payment-history", verifyToken, getUserPaymentHistory);

router.get("/groups", verifyToken, getGroups);

router.post("/request-loan", verifyToken, requestLoan);

router.get("/contributions/overview", verifyToken, getUserContributionOverview);

router.put("/profile", verifyToken, editProfile);

export default router;
