// src/server.js
import dotenv from "dotenv";
import app from "./app.js";
import { connectDB } from "./config/db.config.js";
import { env } from "./config/index.js";
import mongoose from "mongoose";

dotenv.config();

const PORT = env.PORT;

const startServer = async () => {
    try {
        await connectDB();

        const server = app.listen(PORT, () => {
            console.log(` Server running at http://localhost:${PORT}`);
            console.log(` Environment: ${env.NODE_ENV}`);
        });


        const shutdown = async (signal) => {
            console.log(`\nReceived ${signal}. Graceful shutdown...`);
            server.close(async () => {
                try {
                    await mongoose.connection.close(false);
                    console.log(" Mongo connection closed");
                } catch (e) {
                    console.error(" Error closing Mongo connection", e);
                }
                process.exit(0);
            });
            setTimeout(() => process.exit(1), 10_000).unref(); // failsafe
        };

        ["SIGINT", "SIGTERM"].forEach((sig) => process.on(sig, () => shutdown(sig)));

        process.on("unhandledRejection", (err) => {
            console.error("Unhandled Rejection:", err);
            shutdown("unhandledRejection");
        });

        process.on("uncaughtException", (err) => {
            console.error("Uncaught Exception:", err);
            shutdown("uncaughtException");
        });
    } catch (error) {
        console.error(" Failed to start server:", error);
        process.exit(1);
    }
};

startServer();
