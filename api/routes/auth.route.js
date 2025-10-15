import express from "express";
import { checkAccountExists, completeSignup, mobileSignin,requestMobileVerification,requestOtp, resetPassword, sendPasswordResetOtp, signin,  verifyMobileWithOtp, verifyOtp, verifyPasswordResetOtp, verifyResetToken } from "../controllers/auth.controller.js";


const router = express.Router();


router.post("/signin",signin);
router.post("/mobile-signin",mobileSignin);
router.post("/request-otp", requestOtp);
router.post("/verify-otp", verifyOtp);

router.post("/request-mobile-verification", requestMobileVerification);
router.post("/verify-mobile-otp", verifyMobileWithOtp);
router.post("/complete-signup", completeSignup);


router.post("/check-account", checkAccountExists);
router.post("/send-password-reset-otp", sendPasswordResetOtp);
router.post("/verify-password-reset-otp", verifyPasswordResetOtp);
router.post("/verify-reset-token", verifyResetToken);
router.post("/reset-password", resetPassword);




export default router;