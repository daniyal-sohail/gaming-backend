import { User, Client, Consultant } from "../models/index.js";
import {

    comparePassword,
    hashRefreshToken,
    compareRefreshToken,
} from "../helper/auth.helper.js";
import jwt from "jsonwebtoken";
import { ApiError } from "../utils/index.js";
import { env } from "../config/index.js";
import { sendVerificationEmail } from "../utils/email.util.js";
import { OAuth2Client } from "google-auth-library";

const googleClient = new OAuth2Client(env.GOOGLE_CLIENT_ID);

const generateEmailVerificationToken = (userId) => {
    return jwt.sign(
        { id: userId, t: "email_verify" },
        env.JWT_EMAIL_VERIFY_SECRET,
        { expiresIn: "1d" }
    );
};

const registerUser = async ({ name, email, password, user_type }) => {
    const existingUser = await User.findOne({ email });
    if (existingUser) throw new ApiError(400, "User already exists");

    const user = await User.create({
        name,
        email,
        password: password, // Let Mongoose middleware handle hashing
        user_type,
        oauthProvider: "local",
        isVerified: false,
    });

    if (user_type === "client") {
        await Client.create({ user: user._id });
    }
    if (user_type === "consultant") {
        await Consultant.create({ user: user._id });
    }

    const token = generateEmailVerificationToken(user._id);
    await sendVerificationEmail(user.email, user.name, token);

    return { user };
};

const verifyEmail = async (token) => {
    let payload;
    try {
        payload = jwt.verify(token, env.JWT_EMAIL_VERIFY_SECRET);
    } catch (err) {
        throw new ApiError(400, "Invalid or expired token");
    }

    if (payload.t !== "email_verify") {
        throw new ApiError(400, "Invalid token");
    }

    const user = await User.findById(payload.id);
    if (!user) throw new ApiError(404, "User not found");

    user.isVerified = true;
    await user.save({ validateBeforeSave: false });
    return user;
};

const loginUser = async ({ email, password }) => {
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
        throw new ApiError(401, "Invalid email or password");
    }

    if (user.oauthProvider !== "local") {
        throw new ApiError(400, `Use ${user.oauthProvider} login`);
    }

    // Check if email is verified
    if (!user.isVerified) {
        throw new ApiError(400, "Please verify your email address before logging in. Check your inbox for the verification email.");
    }

    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid email or password");
    }

    const accessToken = jwt.sign(
        { _id: user._id, role: user.user_type },
        env.JWT_ACCESS_SECRET,
        { expiresIn: env.JWT_ACCESS_EXPIRES }
    );

    const refreshToken = jwt.sign(
        { _id: user._id },
        env.JWT_REFRESH_SECRET,
        { expiresIn: env.JWT_REFRESH_EXPIRES }
    );

    const hashedRefreshToken = await hashRefreshToken(refreshToken);
    user.refreshToken = hashedRefreshToken;
    await user.save({ validateBeforeSave: false });

    return { user, accessToken, refreshToken };
};

const registerWithGoogle = async (idToken, user_type) => {
    const ticket = await googleClient.verifyIdToken({
        idToken,
        audience: env.GOOGLE_CLIENT_ID
    });

    const payload = ticket.getPayload();
    const email = payload.email;
    const oauthId = payload.sub;
    const name = payload.name || payload.email.split("@")[0];
    const avatar = payload.picture;

    const existingUser = await User.findOne({ email });
    if (existingUser) throw new ApiError(400, "User already exists");

    const user = await User.create({
        name,
        email,
        user_type,
        oauthProvider: "google",
        oauthId,
        oauthAvatar: avatar,
        isVerified: true,
    });

    if (user_type === "client") {
        await Client.create({ user: user._id });
    }
    if (user_type === "consultant") {
        await Consultant.create({ user: user._id });
    }

    return { user };
};

const loginWithGoogle = async (idToken) => {
    const ticket = await googleClient.verifyIdToken({
        idToken,
        audience: env.GOOGLE_CLIENT_ID
    });

    const payload = ticket.getPayload();
    const email = payload.email;

    const user = await User.findOne({ email });
    if (!user) throw new ApiError(404, "User not found. Please register first.");

    if (user.oauthProvider !== "google") {
        throw new ApiError(400, "Account exists with different login method");
    }

    const accessToken = jwt.sign(
        { _id: user._id, role: user.user_type },
        env.JWT_ACCESS_SECRET,
        { expiresIn: env.JWT_ACCESS_EXPIRES }
    );

    const refreshToken = jwt.sign(
        { _id: user._id },
        env.JWT_REFRESH_SECRET,
        { expiresIn: env.JWT_REFRESH_EXPIRES }
    );

    const hashedRefreshToken = await hashRefreshToken(refreshToken);
    user.refreshToken = hashedRefreshToken;
    await user.save({ validateBeforeSave: false });

    return { user, accessToken, refreshToken };
};

const refreshAccessToken = async (refreshToken) => {
    if (!refreshToken) throw new ApiError(401, "Refresh token required");

    let decoded;
    try {
        decoded = jwt.verify(refreshToken, env.JWT_REFRESH_SECRET);
    } catch (error) {
        throw new ApiError(401, "Invalid or expired refresh token");
    }

    const user = await User.findById(decoded._id).select("+refreshToken");
    if (!user) throw new ApiError(401, "Invalid refresh token");

    const isValidRefreshToken = await compareRefreshToken(refreshToken, user.refreshToken);
    if (!isValidRefreshToken) throw new ApiError(401, "Invalid refresh token");

    const newAccessToken = jwt.sign(
        { _id: user._id, role: user.user_type },
        env.JWT_ACCESS_SECRET,
        { expiresIn: env.JWT_ACCESS_EXPIRES }
    );

    return { accessToken: newAccessToken };
};

const logout = async (userId) => {
    const user = await User.findById(userId);
    if (user) {
        user.refreshToken = null;
        await user.save({ validateBeforeSave: false });
    }
    return true;
};

const AuthService = {
    generateEmailVerificationToken,
    registerUser,
    registerWithGoogle,
    verifyEmail,
    loginUser,
    loginWithGoogle,
    refreshAccessToken,
    logout
};

export default AuthService;
