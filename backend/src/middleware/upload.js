import multer from "multer";

const storage = multer.memoryStorage();

export const upload = multer({
    storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
    fileFilter: (req, file, cb) => {
        const allowed = [
            "text/csv",
            "application/vnd.ms-excel", // common for CSV
            "text/plain",
            "application/pdf",
        ];

        if (allowed.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error("Only CSV and PDF files are supported"));
        }
    },
});
