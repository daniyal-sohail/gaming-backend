import Joi from "joi";

export const createBlogSchema = Joi.object({
    title: Joi.string().min(3).max(150).required(),
    content: Joi.string().min(10).required(),
    tags: Joi.array().items(Joi.string().trim()).optional(),
    isPublished: Joi.boolean().optional()
});
