import { v2 as cloudinary } from "cloudinary";
import { env } from "../config/index.js";

const uploadOnCloudinary = async (filePath, options = {}) => {
    try {
        if (!filePath) {
            return null;
        }

        // Configure cloudinary here, not at module level
        cloudinary.config({
            cloud_name: env.CLOUDINARY_NAME,
            api_key: env.CLOUDINARY_API_KEY,
            api_secret: env.CLOUDINARY_API_SECRET
        });

        // Debug the actual values being used
        console.log('Cloudinary config values:', {
            cloud_name: env.CLOUDINARY_NAME,
            api_key: env.CLOUDINARY_API_KEY ? 'SET' : 'MISSING',
            api_secret: env.CLOUDINARY_API_SECRET ? 'SET' : 'MISSING'
        });

        const uploadOptions = {
            resource_type: "auto",
            ...options
        };

        const response = await cloudinary.uploader.upload(filePath, uploadOptions);
        return response;
    } catch (error) {
        console.error('Cloudinary upload error:', error);
        throw error;
    }
}

export { uploadOnCloudinary }
