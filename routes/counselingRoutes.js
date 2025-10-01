import express from "express";
import { submitCounseling, getAllResponses, getResponsePDF } from "../controllers/counselingController.js";
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();

router.post("/submit", submitCounseling); // user
router.get("/responses", authMiddleware, getAllResponses); // admin
router.get("/response/:id/pdf", authMiddleware, getResponsePDF); // admin

export default router;
