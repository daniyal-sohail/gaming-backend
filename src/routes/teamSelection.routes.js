import express from "express";
import teamSelectionController from "../controllers/teamSelection.controller.js";
import { auth, validateBody, validateParams, validateQuery } from "../middlewares/index.js";
import {
    createTeamSchema,
    updateTeamSchema,
    addMemberSchema,
    addMultipleMembersSchema,
    updateMemberSchema,
    calculatePricingSchema,
    livePricingSchema,
    generateShareLinkSchema,
    teamIdParamSchema,
    consultantIdParamSchema,
    shareLinkIdParamSchema,
    listTeamsQuerySchema
} from "../validations/teamSelection.validation.js";

const router = express.Router();

// Public route - no auth required
router.get(
    "/shared/:shareLinkId",
    validateParams(shareLinkIdParamSchema),
    teamSelectionController.getSharedTeam
);

// All other routes require authentication
router.use(auth);

// Team management routes
router.post(
    "/",
    validateBody(createTeamSchema),
    teamSelectionController.createTeam
);

router.get(
    "/",
    validateQuery(listTeamsQuerySchema),
    teamSelectionController.listClientTeams
);

router.get(
    "/:teamId",
    validateParams(teamIdParamSchema),
    teamSelectionController.getTeam
);

router.put(
    "/:teamId",
    validateParams(teamIdParamSchema),
    validateBody(updateTeamSchema),
    teamSelectionController.updateTeam
);

router.delete(
    "/:teamId",
    validateParams(teamIdParamSchema),
    teamSelectionController.deleteTeam
);

// Team member management routes
router.post(
    "/:teamId/members",
    validateParams(teamIdParamSchema),
    validateBody(addMemberSchema),
    teamSelectionController.addMember
);

router.post(
    "/:teamId/members/bulk",
    validateParams(teamIdParamSchema),
    validateBody(addMultipleMembersSchema),
    teamSelectionController.addMultipleMembers
);

router.delete(
    "/:teamId/members/:consultantId",
    validateParams(consultantIdParamSchema),
    teamSelectionController.removeMember
);

router.put(
    "/:teamId/members/:consultantId",
    validateParams(consultantIdParamSchema),
    validateBody(updateMemberSchema),
    teamSelectionController.updateMember
);

// Team recommendations and pricing
router.get(
    "/:teamId/recommendations",
    validateParams(teamIdParamSchema),
    teamSelectionController.getRecommendedConsultants
);

router.post(
    "/:teamId/pricing",
    validateParams(teamIdParamSchema),
    validateBody(calculatePricingSchema),
    teamSelectionController.calculatePricing
);

router.post(
    "/pricing/calculate",
    validateBody(livePricingSchema),
    teamSelectionController.calculateLivePricing
);

// Share functionality
router.post(
    "/:teamId/share",
    validateParams(teamIdParamSchema),
    validateBody(generateShareLinkSchema),
    teamSelectionController.generateShareLink
);

export default router;