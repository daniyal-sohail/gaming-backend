import express from "express";
import authRoutes from "./auth.routes.js";
import userRoutes from "./user.routes.js";
import onboardingRoutes from "./onboarding.routes.js";
import teamSelectionRoutes from "./teamSelection.routes.js";
import clientRoutes from "./client.routes.js";
import { env } from "../config/index.js";

const router = express.Router();

// Mount routes
router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/onboarding", onboardingRoutes);
router.use("/teams", teamSelectionRoutes);
router.use("/client", clientRoutes);

// Health check route
router.get("/health", (req, res) => {
    res.json({
        status: "API is running",
        timestamp: new Date().toISOString(),
        environment: env.NODE_ENV
    });
});

export default router;
