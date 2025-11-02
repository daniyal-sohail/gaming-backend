import express from "express";
import { onboardingController } from "../controllers/index.js";
import { auth, validateBody } from "../middlewares/index.js";
import parseConsultantFormData from "../middlewares/parseFormData.middleware.js";
import {
    clientProfileSchema,
    consultantProfileSchema,
} from "../validations/index.js";
import { upload } from "../config/multer.config.js";

const router = express.Router();

router
    .route("/client/profile")
    .post(auth, validateBody(clientProfileSchema), onboardingController.completeClientProfile)
    .get(auth, onboardingController.getClientProfile)
    .put(auth, validateBody(clientProfileSchema), onboardingController.updateClientProfile);

router
    .route("/consultant/profile")
    .post(
        auth,
        validateBody(consultantProfileSchema),
        onboardingController.completeConsultantProfile
    )
    .get(auth, onboardingController.getConsultantProfile)
    .put(
        auth,
        validateBody(consultantProfileSchema),
        onboardingController.updateConsultantProfile
    );

export default router;