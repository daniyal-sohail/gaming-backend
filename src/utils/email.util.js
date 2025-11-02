import { Resend } from 'resend';
import { emailConfig } from '../config/email.config.js';

const resend = new Resend(emailConfig.resend.apiKey);

export const sendEmail = async ({ to, subject, html, text, from }) => {
    try {
        if (!emailConfig.resend.apiKey) {
            throw new Error('RESEND_API_KEY is not configured in environment variables');
        }

        const emailData = {
            from: from || emailConfig.from.default,
            to: Array.isArray(to) ? to : [to],
            subject,
            html: html || `<p>${text}</p>`,
        };

        const { data, error } = await resend.emails.send(emailData);

        if (error) {
            console.error('Resend error:', error);
            throw new Error(`Failed to send email: ${error.message}`);
        }

        return {
            success: true,
            messageId: data.id,
        };
    } catch (error) {
        console.error('Email sending failed:', error);
        throw new Error('Failed to send email');
    }
};

// Helper functions for common email types
export const sendVerificationEmail = async (to, userName, token) => {
    const verifyUrl = `${emailConfig.urls.verifyEmail}?token=${token}`;

    return sendEmail({
        to,
        from: emailConfig.from.noreply,
        subject: emailConfig.templates.verification.subject,
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2>Verify Your Email Address</h2>
                <p>Hi ${userName},</p>
                <p>Thank you for registering! Please verify your email address by clicking the button below:</p>
                <div style="text-align: center; margin: 30px 0;">
                    <a href="${verifyUrl}" 
                       style="background-color: #007bff; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
                        Verify Email Address
                    </a>
                </div>
                <p>Or copy and paste this link in your browser:</p>
                <p style="word-break: break-all; color: #666;">${verifyUrl}</p>
                <p>This link will expire in 24 hours.</p>
                <p>If you didn't create an account, please ignore this email.</p>
            </div>
        `
    });
};

export const sendEmailChangeVerification = async (to, userName, token) => {
    const verifyUrl = `${emailConfig.urls.verifyEmailChange}?token=${token}`;

    return sendEmail({
        to,
        from: emailConfig.from.noreply,
        subject: emailConfig.templates.emailChange.subject,
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2>Verify Your New Email Address</h2>
                <p>Hi ${userName},</p>
                <p>You requested to change your email address. Please verify your new email address by clicking the button below:</p>
                <div style="text-align: center; margin: 30px 0;">
                    <a href="${verifyUrl}" 
                       style="background-color: #28a745; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
                        Verify New Email Address
                    </a>
                </div>
                <p>Or copy and paste this link in your browser:</p>
                <p style="word-break: break-all; color: #666;">${verifyUrl}</p>
                <p>This link will expire in 24 hours.</p>
                <p>If you didn't request this change, please ignore this email.</p>
            </div>
        `
    });
};

// HTML response templates for verification pages
export const getVerificationSuccessHTML = (email) => {
    return `
        <!DOCTYPE html>
        <html>
        <head>
            <title>Email Verified</title>
            <style>
                body { font-family: Arial, sans-serif; text-align: center; padding: 50px; background-color: #f5f5f5; }
                .container { background: white; padding: 40px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); max-width: 500px; margin: 0 auto; }
                .success { color: #28a745; font-size: 24px; margin-bottom: 20px; }
                .button { background-color: #007bff; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; margin-top: 20px; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="success">✅ Email Verified Successfully!</div>
                <p>Your email <strong>${email}</strong> has been verified.</p>
                <p>You can now close this window and login to your account.</p>
                <a href="#" class="button" onclick="window.close()">Close Window</a>
            </div>
        </body>
        </html>
    `;
};

export const getVerificationErrorHTML = (errorMessage) => {
    return `
        <!DOCTYPE html>
        <html>
        <head>
            <title>Verification Failed</title>
            <style>
                body { font-family: Arial, sans-serif; text-align: center; padding: 50px; background-color: #f5f5f5; }
                .container { background: white; padding: 40px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); max-width: 500px; margin: 0 auto; }
                .error { color: #dc3545; font-size: 24px; margin-bottom: 20px; }
                .button { background-color: #6c757d; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; margin-top: 20px; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="error">❌ Verification Failed</div>
                <p>${errorMessage}</p>
                <p>The verification link may be expired or invalid.</p>
                <a href="#" class="button" onclick="window.close()">Close Window</a>
            </div>
        </body>
        </html>
    `;
};
