// routes/client.routes.js
import express from "express";
import { consultantController } from "../controllers/index.js";
import { auth, isAdmin } from "../middlewares/index.js";

const router = express.Router();

// Already existing routes
router.use(auth);

// --- Consultant browsing routes ---
router.get("/consultants", consultantController.getAllConsultants);
router.get("/consultants/search", consultantController.searchConsultants);
router.get("/consultants/featured", consultantController.getFeaturedConsultants);
router.get("/consultants/skills", consultantController.getConsultantsBySkills);
router.get("/consultants/experience", consultantController.getConsultantsByExperience);
router.get("/consultants/:consultantId", consultantController.getConsultantDetails);

// --- Admin management routes ---
router.get("/admin/consultants", isAdmin, consultantController.adminGetAllConsultants);
router.put("/admin/consultants/approve/:consultantId", isAdmin, consultantController.adminApproveConsultant);
router.put("/admin/consultants/disapprove/:consultantId", isAdmin, consultantController.adminDisapproveConsultant);

// --- Consultant check their approval status ---
router.get("/consultants/status/me", consultantController.getConsultantApprovalStatus);

export default router;
