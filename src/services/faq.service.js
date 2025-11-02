import Faq from "../models/faq.model.js";
import { ApiError } from "../utils/index.js";

const createFaq = async (userId, data) => {
    const { question, answer } = data;
    return await Faq.create({ question, answer, createdBy: userId });
};

const getAllFaqs = async () => {
    return await Faq.find().sort({ createdAt: -1 });
};

const FaqService = {
    createFaq,
    getAllFaqs
};

export default FaqService;
