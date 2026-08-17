const db = require('../database/db');
const path = require('path')
const multer = require('multer')

const uploadMemory = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 10 * 1024 * 1024,
        files: 1
    },

    fileFilter(req, file, next) {
        const allowedTypes = [
            "image/jpeg",
            "image/png",
            "image/webp",
        ];

        if (!allowedTypes.includes(file.mimetype)) {
            return next(new Error("지원하지 않는 이미지 형식입니다."));
        }

        next(null, true);
    },
})

const uploadDisk = multer({
    // 하드에 직접 저장
    storage: multer.diskStorage({
        destination(req, file, next) {
            const dir = path.resolve(__dirname, '../uploads')
            next(null, dir)
        },
        filename(req, file, next) {
            const ext = {
                "image/jpeg": ".jpg",
                "image/png": ".png",
                "image/webp": ".webp",
            }[file.mimetype]

            const filename = `${new Date()}${ext}`
            next(null, filename)
        }
    }),

    limits: {
        fileSize: 10 * 1024 * 1024,
        files: 1
    },
    fileFilter(req, file, next) {
        const allowedTypes = [
            "image/jpeg",
            "image/png",
            "image/webp",
        ];

        if (!allowedTypes.includes(file.mimetype)) {
            return next(new Error("지원하지 않는 이미지 형식입니다."));
        }

        next(null, true);
    },
});



module.exports = {
    uploadDisk,
    uploadMemory
}