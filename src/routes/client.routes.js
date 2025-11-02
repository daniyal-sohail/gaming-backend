import express from "express";
import { clientController } from "../controllers/index.js";
import { auth } from "../middlewares/index.js";

const router = express.Router();

// All routes require authentication
router.use(auth);

// Consultant browsing routes
router.get("/consultants", clientController.getAllConsultants);
router.get("/consultants/search", clientController.searchConsultants);
router.get("/consultants/featured", clientController.getFeaturedConsultants);
router.get("/consultants/skills", clientController.getConsultantsBySkills);
router.get("/consultants/experience", clientController.getConsultantsByExperience);
router.get("/consultants/:consultantId", clientController.getConsultantDetails);

export default router;
