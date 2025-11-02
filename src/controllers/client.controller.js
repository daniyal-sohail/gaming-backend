import ClientService from "../services/client.service.js";
import { ApiResponse, ApiError } from "../utils/index.js";

export const searchConsultants = async (req, res) => {
    try {
        const { skills, minExperience, preferredTimezone, remote, maxHourlyRate } = req.query;
        const { page = 1, limit = 10, sort = "-createdAt" } = req.query;

        // Parse skills if provided as comma-separated string
        const skillsArray = skills ? skills.split(',').map(s => s.trim()) : undefined;

        const requirements = {
            skills: skillsArray,
            minExperience: minExperience ? Number(minExperience) : undefined,
            preferredTimezone,
            remote: remote ? remote === 'true' : undefined,
            maxHourlyRate: maxHourlyRate ? Number(maxHourlyRate) : undefined
        };

        const result = await ClientService.searchConsultants(requirements, {
            page: Number(page),
            limit: Number(limit),
            sort
        });

        res.status(200).json(new ApiResponse(200, result, "Consultants retrieved successfully"));
    } catch (error) {
        throw new ApiError(error.statusCode || 500, error.message);
    }
};

export const getAllConsultants = async (req, res) => {
    try {
        const { page = 1, limit = 20, sort = "-createdAt" } = req.query;

        const result = await ClientService.getAllConsultants({
            page: Number(page),
            limit: Number(limit),
            sort
        });

        res.status(200).json(new ApiResponse(200, result, "All consultants retrieved successfully"));
    } catch (error) {
        throw new ApiError(error.statusCode || 500, error.message);
    }
};

export const getConsultantDetails = async (req, res) => {
    try {
        const { consultantId } = req.params;

        const consultant = await ClientService.getConsultantDetails(consultantId);

        res.status(200).json(new ApiResponse(200, consultant, "Consultant details retrieved successfully"));
    } catch (error) {
        throw new ApiError(error.statusCode || 500, error.message);
    }
};

export const getFeaturedConsultants = async (req, res) => {
    try {
        const { limit = 10 } = req.query;

        const consultants = await ClientService.getFeaturedConsultants({
            limit: Number(limit)
        });

        res.status(200).json(new ApiResponse(200, consultants, "Featured consultants retrieved successfully"));
    } catch (error) {
        throw new ApiError(error.statusCode || 500, error.message);
    }
};

export const getConsultantsBySkills = async (req, res) => {
    try {
        const { skills } = req.query;
        const { limit = 20 } = req.query;

        // Parse skills if provided as comma-separated string
        const skillsArray = skills ? skills.split(',').map(s => s.trim()) : [];

        const consultants = await ClientService.getConsultantsBySkills(skillsArray, {
            limit: Number(limit)
        });

        res.status(200).json(new ApiResponse(200, consultants, "Consultants by skills retrieved successfully"));
    } catch (error) {
        throw new ApiError(error.statusCode || 500, error.message);
    }
};

export const getConsultantsByExperience = async (req, res) => {
    try {
        const { minExperience } = req.query;
        const { limit = 20 } = req.query;

        if (!minExperience) {
            throw new ApiError(400, "minExperience parameter is required");
        }

        const consultants = await ClientService.getConsultantsByExperience(Number(minExperience), {
            limit: Number(limit)
        });

        res.status(200).json(new ApiResponse(200, consultants, "Consultants by experience retrieved successfully"));
    } catch (error) {
        throw new ApiError(error.statusCode || 500, error.message);
    }
};

const clientController = {
    searchConsultants,
    getAllConsultants,
    getConsultantDetails,
    getFeaturedConsultants,
    getConsultantsBySkills,
    getConsultantsByExperience
};

export default clientController;
