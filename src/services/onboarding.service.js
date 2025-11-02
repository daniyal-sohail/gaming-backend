import { Client, Consultant } from "../models/index.js";
import { ApiError } from "../utils/index.js";

// --- COMPLETE CLIENT PROFILE ---
const completeClientProfile = async (userId, payload) => {
    let client = await Client.findOne({ user: userId });
    if (!client) client = new Client({ user: userId });

    const allowed = [
        "companyName",
        "companyWebsite",
        "billingContactName",
        "billingContactEmail",
        "billingAddress",
        "defaultCurrency",
        "timezone",
        "languagePreference"
    ];

    for (const key of allowed) {
        if (payload[key] !== undefined) client[key] = payload[key];
    }

    await client.save();
    return client;
};

// --- COMPLETE CONSULTANT PROFILE ---
const completeConsultantProfile = async (userId, payload) => {
    let consultant = await Consultant.findOne({ user: userId });
    if (!consultant) consultant = new Consultant({ user: userId });

    const allowed = [
        "headline",
        "bio",
        "roles",
        "skills",
        "badges",
        "level",
        "baseRate",
        "experienceYears",
        "availability",
        "locations",
        "portfolioLinks"
    ];

    for (const key of allowed) {
        if (payload[key] !== undefined) consultant[key] = payload[key];
    }

    // Don't auto-approve consultants
    consultant.approved = false;

    await consultant.save();
    return consultant;
};

// --- GET CLIENT PROFILE ---
const getClientProfile = async (userId) => {
    const client = await Client.findOne({ user: userId });
    if (!client) throw new ApiError(404, "Client profile not found");
    return client;
};

// --- GET CONSULTANT PROFILE ---
const getConsultantProfile = async (userId) => {
    const consultant = await Consultant.findOne({ user: userId });
    if (!consultant) throw new ApiError(404, "Consultant profile not found");
    return consultant;
};

// --- UPDATE CLIENT PROFILE (VALIDATED) ---
const updateClientProfile = async (userId, payload) => {
    const allowed = [
        "companyName",
        "companyWebsite",
        "billingContactName",
        "billingContactEmail",
        "billingAddress",
    ];

    const updateData = {};
    for (const key of allowed) {
        if (payload[key] !== undefined) updateData[key] = payload[key];
    }

    if (Object.keys(updateData).length === 0) {
        throw new ApiError(400, "No valid fields provided for update");
    }

    const client = await Client.findOneAndUpdate({ user: userId }, updateData, { new: true, runValidators: true });
    if (!client) throw new ApiError(404, "Client profile not found");
    return client;
};

// --- UPDATE CONSULTANT PROFILE (VALIDATED) ---
const updateConsultantProfile = async (userId, payload) => {
    const allowed = [
        "headline",
        "bio",
        "roles",
        "skills",
        "badges",
        "level",
        "baseRate",
        "experienceYears",
        "availability",
        "locations",
        "portfolioLinks"
    ];

    const updateData = {};
    for (const key of allowed) {
        if (payload[key] !== undefined) updateData[key] = payload[key];
    }

    if (Object.keys(updateData).length === 0) {
        throw new ApiError(400, "No valid fields provided for update");
    }

    const consultant = await Consultant.findOneAndUpdate({ user: userId }, updateData, { new: true, runValidators: true });
    if (!consultant) throw new ApiError(404, "Consultant profile not found");
    return consultant;
};

const OnboardingService = {
    completeClientProfile,
    completeConsultantProfile,
    getClientProfile,
    getConsultantProfile,
    updateClientProfile,
    updateConsultantProfile
};

export default OnboardingService;