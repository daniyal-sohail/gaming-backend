/**
 * Middleware to parse FormData JSON strings back to objects/arrays
 * Must be used AFTER multer and BEFORE validation
 */
const parseConsultantFormData = (req, res, next) => {
    try {
        // Fields that should be parsed as JSON (for consultant profiles)
        const jsonFields = [
            'roles',
            'skills',
            'badges',
            'locations',
            'portfolioLinks',
            'baseRate',
            'availability',
            'capacity',
            'billingAddress'
        ];

        // Parse JSON strings back to objects/arrays
        jsonFields.forEach(field => {
            if (req.body[field] && typeof req.body[field] === 'string') {
                try {
                    req.body[field] = JSON.parse(req.body[field]);
                } catch (e) {
                    // If parsing fails, leave as is (will be caught by validation)
                    console.error(`Failed to parse ${field}:`, e.message);
                }
            }
        });

        if (req.body.experienceYears) {
            req.body.experienceYears = Number(req.body.experienceYears);
        }

        next();
    } catch (error) {
        next(error);
    }
};

export default parseConsultantFormData;