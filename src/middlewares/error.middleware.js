import { ApiResponse, ApiError } from "../utils/index.js";
import { env } from "../config/index.js";

const errorHandler = (err, req, res, _next) => {
    const isApiErr = err instanceof ApiError;
    let statusCode = isApiErr ? err.statusCode : err.status || 500;
    let message = err.message || "Internal Server Error";
    let details = err.details || null;

    if (err?.name === "ValidationError") {
        statusCode = 400;
        const fieldErrors = Object.values(err.errors || {}).map((e) => e.message);
        if (fieldErrors.length) message = fieldErrors.join(", ");
    }

    // Handle Joi validation errors (from our validation middleware)
    if (err.message === "Validation Error" && err.details) {
        statusCode = 400;
        message = "Validation Error";
        details = err.details;
    }

    if (err?.name === "CastError" && err?.kind === "ObjectId") {
        statusCode = 400;
        message = `Invalid ID: ${err?.value}`;
    }

    if (
        err?.code === "EAUTH" ||
        err?.responseCode === 535 ||
        /535|Invalid login|authentication failed|Invalid credentials/i.test(err?.message || "")
    ) {
        statusCode = 502;
        message = "Email service authentication failed.";
    }

    const payload = new ApiResponse(statusCode, null, message);
    if (details) {
        payload.details = details;
    }
    if (env.NODE_ENV !== "production" && err?.stack) {
        payload.stack = err.stack;
    }

    return res.status(statusCode).json(payload);
};

export default errorHandler;
