import { ApiError } from "../utils/index.js";

/**
 * Middleware to verify if the authenticated user is an admin.
 */
export const isAdmin = (req, _res, next) => {
    try {
        if (!req.user) {
            return next(new ApiError(401, "Unauthorized: user not authenticated"));
        }

        if (req.user.user_type !== "admin") {
            return next(new ApiError(403, "Access denied: Admins only"));
        }

        next();
    } catch (error) {
        next(new ApiError(500, "Error verifying admin role"));
    }
};
