// Export all middlewares
import { auth } from "./auth.middleware.js";
import { isAdmin } from "./admin.middleware.js";
import errorHandler from "./error.middleware.js";
import notFoundHandler from "./notFound.middleware.js";
import {
    validate,
    validateBody,
    validateParams,
    validateQuery,
    validateHeaders
} from "./validation.middleware.js";

export {
    auth,
    isAdmin,
    errorHandler,
    notFoundHandler,
    validate,
    validateBody,
    validateParams,
    validateQuery,
    validateHeaders
};

// Default export for convenience
export default {
    auth,
    isAdmin,
    errorHandler,
    notFoundHandler,
    validate,
    validateBody,
    validateParams,
    validateQuery,
    validateHeaders
};
