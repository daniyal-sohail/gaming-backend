import { User } from "../models/index.js";
import { ApiError } from "../utils/index.js";
import { hashPassword, comparePassword } from "../helper/auth.helper.js";
import { sendEmailChangeVerification } from "../utils/email.util.js";
import jwt from "jsonwebtoken";
import { env } from "../config/index.js";

const generateEmailVerificationToken = (userId, newEmail) => {
    return jwt.sign(
        { id: userId, email: newEmail, t: "email_change" },
        env.JWT_EMAIL_VERIFY_SECRET,
        { expiresIn: "1d" }
    );
};

const getProfile = async (userId) => {
    const user = await User.findById(userId).select("-password -refreshToken");
    if (!user) throw new ApiError(404, "User not found");
    return user;
};

const updateProfile = async (userId, updateData) => {
    const { name, email, currentPassword, newPassword } = updateData;
    let result = {};

    const user = await User.findById(userId).select("+password");
    if (!user) throw new ApiError(404, "User not found");

    // Handle basic profile updates (name, phone)
    const basicUpdates = {};
    if (name !== undefined) basicUpdates.name = name;

    if (Object.keys(basicUpdates).length > 0) {
        await User.findByIdAndUpdate(
            userId,
            { $set: basicUpdates },
            { new: true, runValidators: true }
        );
        result.profileUpdated = true;
    }

    // Handle email update
    // Handle email update
    if (email !== undefined) {
        // Only check if email is different from current email
        if (email !== user.email) {
            const existingUser = await User.findOne({ email });
            if (existingUser && existingUser._id.toString() !== userId) {
                throw new ApiError(400, "Email already in use");
            }

            // Update email directly since verification is disabled
            await User.findByIdAndUpdate(
                userId,
                { $set: { email: email, isVerified: true } },
                { new: true, runValidators: true }
            );
            result.emailUpdated = true;

            // const token = generateEmailVerificationToken(userId, email);
            // await sendEmailChangeVerification(email, user.name, token);

            // result.emailVerificationSent = true;
        }
    }

    // Handle password change
    if (currentPassword && newPassword) {
        if (user.oauthProvider !== "local") {
            throw new ApiError(400, "Cannot change password for OAuth accounts");
        }

        const isCurrentPasswordValid = await comparePassword(currentPassword, user.password);
        if (!isCurrentPasswordValid) {
            throw new ApiError(400, "Current password is incorrect");
        }

        const hashedNewPassword = await hashPassword(newPassword);
        await User.findByIdAndUpdate(userId, { password: hashedNewPassword });
        result.passwordChanged = true;
    }

    // Get updated user data
    const updatedUser = await User.findById(userId).select("-password -refreshToken");

    return {
        user: updatedUser,
        updates: result
    };
};

const verifyEmailChange = async (token) => {
    let payload;
    try {
        payload = jwt.verify(token, env.JWT_EMAIL_VERIFY_SECRET);
    } catch (err) {
        throw new ApiError(400, "Invalid or expired token");
    }

    if (payload.t !== "email_change") {
        throw new ApiError(400, "Invalid token");
    }

    const user = await User.findById(payload.id);
    if (!user) throw new ApiError(404, "User not found");

    const existingUser = await User.findOne({ email: payload.email });
    if (existingUser && existingUser._id.toString() !== payload.id) {
        throw new ApiError(400, "Email already in use");
    }

    user.email = payload.email;
    user.isVerified = true;
    await user.save({ validateBeforeSave: false });
    return user;
};

const setEmailVerified = async (userId) => {
    const user = await User.findById(userId);
    if (!user) throw new ApiError(404, "User not found");

    user.isVerified = true;
    await user.save({ validateBeforeSave: false });
    return user;
};

const UserService = {
    getProfile,
    updateProfile,
    verifyEmailChange,
    setEmailVerified
};

export default UserService;
