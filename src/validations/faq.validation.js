import Joi from "joi";

export const createFaqSchema = Joi.object({
    question: Joi.string().min(5).max(255).required(),
    answer: Joi.string().min(5).required()
});
