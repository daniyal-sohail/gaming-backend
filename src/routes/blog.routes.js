import express from "express";
import multer from "multer";
import { auth, isAdmin, validateBody } from "../middlewares/index.js";
import { createBlogSchema } from "../validations/blog.validation.js";
import * as blogController from "../controllers/blog.controller.js";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

// Admin-only
router.post("/", auth, isAdmin, upload.single("image"), validateBody(createBlogSchema), blogController.createBlog);

// Public routes
router.get("/", blogController.getAllBlogs);
router.get("/:id", blogController.getBlogById);

export default router;
