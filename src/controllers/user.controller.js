import UserService from "../services/user.service.js";
import { ApiResponse, ApiError } from "../utils/index.js";

export const getProfile = async (req, res) => {
    try {
        const user = await UserService.getProfile(req.user._id);
        res.status(200).json(new ApiResponse(200, user, "User profile retrieved"));
    } catch (err) {
        throw new ApiError(400, err.message);
    }
};

export const updateProfile = async (req, res) => {
    try {
        const result = await UserService.updateProfile(req.user._id, req.body);

        let message = "Profile updated successfully";
        if (result.updates.emailVerificationSent) {
            message += ". Email verification sent to new address";
        }
        if (result.updates.passwordChanged) {
            message += ". Password changed successfully";
        }

        res.status(200).json(new ApiResponse(200, {
            user: result.user,
            updates: result.updates
        }, message));
    } catch (err) {
        throw new ApiError(400, err.message);
    }
};

export const verifyEmailChange = async (req, res) => {
    const { token } = req.query;

    try {
        const user = await UserService.verifyEmailChange(token);
        res.status(200).json(new ApiResponse(200, {
            id: user._id,
            email: user.email
        }, "Email updated successfully"));
    } catch (err) {
        throw new ApiError(400, err.message);
    }
};
