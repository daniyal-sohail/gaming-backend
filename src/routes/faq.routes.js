import express from "express";
import { auth, isAdmin, validateBody } from "../middlewares/index.js";
import { createFaqSchema } from "../validations/faq.validation.js";
import * as faqController from "../controllers/faq.controller.js";

const router = express.Router();

// Admin-only
router.post("/", auth, isAdmin, validateBody(createFaqSchema), faqController.createFaq);

// Public
router.get("/", faqController.getAllFaqs);

export default router;
