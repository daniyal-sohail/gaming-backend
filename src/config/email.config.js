import { env } from "./index.js";

export const emailConfig = {
    // Email Service Provider
    provider: "resend",

    // Resend Configuration
    resend: {
        apiKey: env.RESEND_API_KEY,
    },
    // Email Settings
    from: {
        default: env.FROM_EMAIL && !env.FROM_EMAIL.includes('yourdomain.com') ? env.FROM_EMAIL : 'onboarding@resend.dev',
        noreply: env.FROM_EMAIL && !env.FROM_EMAIL.includes('yourdomain.com') ? env.FROM_EMAIL : 'onboarding@resend.dev',
        support: env.ADMIN_EMAIL && !env.ADMIN_EMAIL.includes('yourdomain.com') ? env.ADMIN_EMAIL : 'support@resend.dev',
        admin: env.ADMIN_EMAIL && !env.ADMIN_EMAIL.includes('yourdomain.com') ? env.ADMIN_EMAIL : 'support@resend.dev',
    },

    // Email Templates Configuration
    templates: {
        verification: {
            subject: "Verify your email address",
            template: "email-verification"
        },
        emailChange: {
            subject: "Verify your new email address",
            template: "email-change-verification"
        },
        passwordReset: {
            subject: "Reset your password",
            template: "password-reset"
        },
        welcome: {
            subject: "Welcome to our platform!",
            template: "welcome"
        }
    },

    // URL Configuration
    urls: {
        frontend: env.FRONTEND_URL,
        verifyEmail: `http://localhost:${env.PORT}/api/v1/auth/verify-email`,
        verifyEmailChange: `http://localhost:${env.PORT}/api/v1/users/verify-email-change`,
        resetPassword: `${env.FRONTEND_URL}/reset-password`,
    },

    // Email Options
    options: {
        retryAttempts: 3,
        retryDelay: 1000, // milliseconds
        timeout: 10000, // 10 seconds
    }
};

export default emailConfig;
