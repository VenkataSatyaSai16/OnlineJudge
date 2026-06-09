import express from "express";
import {registerUser,loginUser,googleLogin,checkUsername,logout} from "../controllers/authController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register",registerUser);
router.post("/login",loginUser);
router.post("/google",googleLogin);
router.get("/check-username/:username",checkUsername);
router.post("/logout",logout);

export default router;
