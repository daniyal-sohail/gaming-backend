import BlogService from "../services/blog.service.js";
import { ApiResponse, ApiError } from "../utils/index.js";

export const createBlog = async (req, res) => {
    try {
        const blog = await BlogService.createBlog(req.user._id, req.body, req.file?.path);
        res.status(201).json(new ApiResponse(201, blog, "Blog created successfully"));
    } catch (err) {
        throw new ApiError(400, err.message);
    }
};

export const getAllBlogs = async (_req, res) => {
    try {
        const blogs = await BlogService.getAllBlogs();
        res.status(200).json(new ApiResponse(200, blogs, "Blogs retrieved successfully"));
    } catch (err) {
        throw new ApiError(400, err.message);
    }
};

export const getBlogById = async (req, res) => {
    try {
        const blog = await BlogService.getBlogById(req.params.id);
        res.status(200).json(new ApiResponse(200, blog, "Blog details fetched"));
    } catch (err) {
        throw new ApiError(400, err.message);
    }
};
