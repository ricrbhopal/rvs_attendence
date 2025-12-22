import express from "express";
import { Protect } from "../middleware/authMiddleware.js";
import { adminLogin, adminLogout } from "../controllers/authController.js";

const router = express.Router();
router.post("/login", adminLogin);
router.post("/logout", Protect, adminLogout);
export default router;
