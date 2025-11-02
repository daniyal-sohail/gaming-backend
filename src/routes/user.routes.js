import express from "express";
import { userController } from "../controllers/index.js";
import { auth, validateBody } from "../middlewares/index.js";
import { updateProfileSchema } from "../validations/index.js";

const router = express.Router();

// User profile routes with validation
router.get("/profile", auth, userController.getProfile);
router.put("/profile", auth, validateBody(updateProfileSchema), userController.updateProfile);

// Email verification route (for email changes)
router.get("/verify-email-change", userController.verifyEmailChange);

export default router;
