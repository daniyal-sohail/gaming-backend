import Joi from "joi";

// User profile update validation
export const updateProfileSchema = Joi.object({
    name: Joi.string()
        .trim()
        .min(2)
        .max(50)
        .optional()
        .messages({
            'string.min': 'Name must be at least 2 characters long',
            'string.max': 'Name cannot exceed 50 characters'
        }),

    phone: Joi.string()
        .trim()
        .pattern(new RegExp('^[+]?[1-9]\\d{1,14}$'))
        .optional()
        .allow('')
        .messages({
            'string.pattern.base': 'Please provide a valid phone number'
        }),

    email: Joi.string()
        .email()
        .lowercase()
        .trim()
        .optional()
        .messages({
            'string.email': 'Please provide a valid email address'
        }),

    currentPassword: Joi.string()
        .optional()
        .messages({
            'string.empty': 'Current password is required when changing password'
        }),

    newPassword: Joi.string()
        .min(6)
        .max(128)
        .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)'))
        .optional()
        .messages({
            'string.min': 'New password must be at least 6 characters long',
            'string.max': 'New password cannot exceed 128 characters',
            'string.pattern.base': 'New password must contain at least one uppercase letter, one lowercase letter, and one number'
        })
}).custom((value, helpers) => {
    // If one password field is provided, both must be provided
    if ((value.currentPassword && !value.newPassword) || (!value.currentPassword && value.newPassword)) {
        return helpers.error('custom.passwordBoth');
    }
    return value;
}).messages({
    'custom.passwordBoth': 'Both current password and new password are required when changing password'
});

// User ID validation (for params)
export const userIdSchema = Joi.object({
    id: Joi.string()
        .pattern(new RegExp('^[0-9a-fA-F]{24}$'))
        .required()
        .messages({
            'string.pattern.base': 'Invalid user ID format',
            'string.empty': 'User ID is required'
        })
});

// Query parameters validation
export const querySchema = Joi.object({
    page: Joi.number()
        .integer()
        .min(1)
        .default(1)
        .optional(),

    limit: Joi.number()
        .integer()
        .min(1)
        .max(100)
        .default(10)
        .optional(),

    sort: Joi.string()
        .valid('name', 'email', 'createdAt', 'updatedAt', '-name', '-email', '-createdAt', '-updatedAt')
        .default('-createdAt')
        .optional(),

    search: Joi.string()
        .trim()
        .max(100)
        .optional()
        .messages({
            'string.max': 'Search term cannot exceed 100 characters'
        })
});
