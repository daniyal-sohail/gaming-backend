import FaqService from "../services/faq.service.js";
import { ApiResponse, ApiError } from "../utils/index.js";

export const createFaq = async (req, res) => {
    try {
        const faq = await FaqService.createFaq(req.user._id, req.body);
        res.status(201).json(new ApiResponse(201, faq, "FAQ created successfully"));
    } catch (err) {
        throw new ApiError(400, err.message);
    }
};

export const getAllFaqs = async (_req, res) => {
    try {
        const faqs = await FaqService.getAllFaqs();
        res.status(200).json(new ApiResponse(200, faqs, "FAQs retrieved successfully"));
    } catch (err) {
        throw new ApiError(400, err.message);
    }
};
