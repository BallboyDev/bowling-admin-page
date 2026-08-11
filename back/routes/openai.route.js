const express = require('express')
const router = express.Router()
const multer = require('multer')

const openaiService = require('./openai.service')

const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 10 * 1024 * 1024,
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



router.post('/', async (req, res) => {

    const result = process.env.OPENAI_API_KEY
    // const result = await openaiService.test1(req, res)

    res.json(result)
})

router.post('/upload', upload.single("image"), async (req, res) => {
    const result = await openaiService.upload(req, res)

    res.json(result)
})

module.exports = router