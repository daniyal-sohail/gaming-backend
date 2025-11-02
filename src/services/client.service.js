import { Consultant } from "../models/index.js";
import { ApiError } from "../utils/index.js";

const searchConsultants = async (requirements = {}, { page = 1, limit = 10, sort = "-createdAt" } = {}) => {
    const { skills, minExperience, preferredTimezone, remote, maxHourlyRate } = requirements;

    // Build filter query
    const filter = { approved: true }; // Only show approved consultants

    // Filter by skills
    if (skills && skills.length > 0) {
        filter.skills = { $in: skills };
    }

    // Filter by minimum experience
    if (typeof minExperience === "number" && minExperience > 0) {
        filter.experienceYears = { $gte: minExperience };
    }

    // Filter by timezone preference
    if (preferredTimezone) {
        filter["availability.timezone"] = preferredTimezone;
    }

    // Filter by remote availability
    if (typeof remote === "boolean") {
        filter["availability.remote"] = remote;
    }

    // Filter by maximum hourly rate
    if (typeof maxHourlyRate === "number" && maxHourlyRate > 0) {
        filter["baseRate.hourly"] = { $lte: maxHourlyRate };
    }

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Execute query with population
    const consultants = await Consultant.find(filter)
        .populate({
            path: "user",
            select: "name email user_type isVerified"
        })
        .sort(sort)
        .skip(skip)
        .limit(limit);

    const total = await Consultant.countDocuments(filter);

    return {
        consultants,
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / limit)
    };
};

const getConsultantDetails = async (consultantId) => {
    const consultant = await Consultant.findById(consultantId)
        .populate({
            path: "user",
            select: "name email user_type isVerified"
        });

    if (!consultant) throw new ApiError(404, "Consultant not found");
    if (!consultant.approved) throw new ApiError(404, "Consultant not available");

    return consultant;
};

const getFeaturedConsultants = async ({ limit = 10 } = {}) => {
    const consultants = await Consultant.find({
        approved: true,
        visibility: "public"
    })
        .populate({
            path: "user",
            select: "name email user_type isVerified"
        })
        .sort("-experienceYears -createdAt")
        .limit(limit);

    return consultants;
};

const getConsultantsBySkills = async (skills, { limit = 20 } = {}) => {
    if (!skills || skills.length === 0) {
        return await getFeaturedConsultants({ limit });
    }

    const consultants = await Consultant.find({
        approved: true,
        skills: { $in: skills },
        visibility: "public"
    })
        .populate({
            path: "user",
            select: "name email user_type isVerified"
        })
        .sort("-experienceYears -createdAt")
        .limit(limit);

    return consultants;
};

const getConsultantsByExperience = async (minExperience, { limit = 20 } = {}) => {
    const consultants = await Consultant.find({
        approved: true,
        experienceYears: { $gte: minExperience },
        visibility: "public"
    })
        .populate({
            path: "user",
            select: "name email user_type isVerified"
        })
        .sort("-experienceYears -createdAt")
        .limit(limit);

    return consultants;
};

const getAllConsultants = async ({ page = 1, limit = 20, sort = "-createdAt" } = {}) => {
    const skip = (page - 1) * limit;

    const consultants = await Consultant.find({
        approved: true,
        visibility: "public"
    })
        .populate({
            path: "user",
            select: "name email user_type isVerified"
        })
        .sort(sort)
        .skip(skip)
        .limit(limit);

    const total = await Consultant.countDocuments({
        approved: true,
        visibility: "public"
    });

    return {
        consultants,
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / limit)
    };
};

const ClientService = {
    searchConsultants,
    getConsultantDetails,
    getFeaturedConsultants,
    getConsultantsBySkills,
    getConsultantsByExperience,
    getAllConsultants
};

export default ClientService;
