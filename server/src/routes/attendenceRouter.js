import express from "express";
import {
  MarkAttendence,
  ViewAttendence,
  GetAllNames,
} from "../controllers/attendenceController.js";

const router = express.Router();

router.post("/mark/:rfid", MarkAttendence);
router.get("/view/:teacherId", ViewAttendence);
router.get("/allNames", GetAllNames);

export default router;
