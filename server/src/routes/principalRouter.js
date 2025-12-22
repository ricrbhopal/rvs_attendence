import express from "express";

import { Protect } from "../middleware/authMiddleware.js";
import {
  getAllTeachers,
  addTeacher,
  updateTeacher,
  
  updateTeacherStatus,
} from "../controllers/principalController.js";

const router = express.Router();

router.get("/allTeachers", Protect, getAllTeachers);
router.post("/addTeacher", Protect, addTeacher);
router.put("/updateTeacher/:teacherId", Protect, updateTeacher);
router.patch("/updateStatus/:teacherId", Protect, updateTeacherStatus);

export default router;
  