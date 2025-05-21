import express from "express";
import {
  getSignMessage,
  issueTokenAfterVerify,
} from "../controllers/auth.controller";
import {
  validateAddressQuery,
  verifySignatureMiddleware,
} from "../middlewares/validate-address.middleware";

const router = express.Router();

router.get("/message", validateAddressQuery, getSignMessage);
router.post("/verify", verifySignatureMiddleware as any, issueTokenAfterVerify as any);

export default router;
