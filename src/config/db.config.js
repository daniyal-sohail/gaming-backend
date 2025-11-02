import mongoose from "mongoose";
import { env } from "./index.js";

let isConnected = false;

export const connectDB = async () => {
    try {
        if (isConnected || mongoose.connection.readyState === 1) {
            console.log("MongoDB already connected");
            return mongoose.connection;
        }

        const uri = env.MONGO_URI;
        if (!uri) throw new Error("MONGO_URI is missing");

        mongoose.set("strictQuery", true);
        if (env.NODE_ENV === "production") {
            mongoose.set("autoIndex", false);
        }

        const conn = await mongoose.connect(uri, {
            maxPoolSize: 10,
        });

        isConnected = true;

        mongoose.connection.on("error", (err) => {
            console.error(" MongoDB connection error:", err);
        });
        mongoose.connection.on("disconnected", () => {
            isConnected = false;
            console.warn(" MongoDB disconnected");
        });

        console.log(` MongoDB connected: ${conn.connection.host}`);
        return conn;
    } catch (error) {
        console.error(" MongoDB connection failed:", error?.message || error);
        process.exit(1);
    }
};
