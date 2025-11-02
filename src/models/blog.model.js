import mongoose from "mongoose";

const blogSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, "Blog title is required"],
            trim: true,
        },
        content: {
            type: String,
            required: [true, "Blog content is required"],
        },
        imageUrl: {
            type: String,
            trim: true,
        },
        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        tags: [
            {
                type: String,
                trim: true,
            },
        ],
        isPublished: {
            type: Boolean,
            default: true,
        },
    },
    { timestamps: true }
);

const Blog = mongoose.model("Blog", blogSchema);
export default Blog;
