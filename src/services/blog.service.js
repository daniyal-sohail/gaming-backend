import Blog from "../models/blog.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.util.js";
import { ApiError } from "../utils/index.js";

const createBlog = async (authorId, data, filePath) => {
    const { title, content, tags, isPublished } = data;

    let imageUrl = null;
    if (filePath) {
        const uploadResponse = await uploadOnCloudinary(filePath, { folder: "blogs" });
        imageUrl = uploadResponse.secure_url;
    }

    const blog = await Blog.create({
        title,
        content,
        imageUrl,
        author: authorId,
        tags,
        isPublished
    });

    return blog;
};

const getAllBlogs = async () => {
    return Blog.find({ isPublished: true }).populate("author", "name email");
};

const getBlogById = async (id) => {
    const blog = await Blog.findById(id).populate("author", "name email");
    if (!blog) throw new ApiError(404, "Blog not found");
    return blog;
};

const BlogService = {
    createBlog,
    getAllBlogs,
    getBlogById
};

export default BlogService;
