import multer from "multer";

export const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 * 1024 }, // 5GB
    fileFilter: (_req, file, cb) => {
        // Allow images and PDFs for CV uploads
        if (!/^image\//.test(file.mimetype) && file.mimetype !== 'application/pdf') {
            return cb(new Error("Only images and PDF files allowed"));
        }
        cb(null, true);
    },
});
