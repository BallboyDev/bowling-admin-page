import express from "express";
import multer from "multer";
import OpenAI from "openai";
import "dotenv/config";

const app = express();

const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 10 * 1024 * 1024,
    },
    fileFilter(req, file, callback) {
        const allowedTypes = [
            "image/jpeg",
            "image/png",
            "image/webp",
        ];

        if (!allowedTypes.includes(file.mimetype)) {
            return callback(new Error("지원하지 않는 이미지 형식입니다."));
        }

        callback(null, true);
    },
});

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

app.post(
    "/api/images/analyze",
    upload.single("image"),
    async (req, res) => {
        try {
            if (!req.file) {
                return res.status(400).json({
                    message: "이미지 파일이 필요합니다.",
                });
            }

            const base64Image = req.file.buffer.toString("base64");
            const imageDataUrl =
                `data:${req.file.mimetype};base64,${base64Image}`;

            const response = await openai.responses.create({
                model: "gpt-4o-mini",

                input: [
                    {
                        role: "user",
                        content: [
                            {
                                type: "input_text",
                                text: `
이미지를 분석하여 영수증 정보를 추출하세요.

규칙:
- 이미지에 없는 값은 추측하지 마세요.
- 확인할 수 없는 문자열은 null로 반환하세요.
- totalAmount와 item.price는 숫자로 반환하세요.
- 날짜는 YYYY-MM-DD 형식으로 반환하세요.
                `.trim(),
                            },
                            {
                                type: "input_image",
                                image_url: imageDataUrl,
                            },
                        ],
                    },
                ],

                text: {
                    format: {
                        type: "json_schema",
                        name: "receipt_analysis",
                        strict: true,
                        schema: {
                            type: "object",
                            properties: {
                                storeName: {
                                    type: ["string", "null"],
                                },
                                purchasedAt: {
                                    type: ["string", "null"],
                                },
                                totalAmount: {
                                    type: ["number", "null"],
                                },
                                currency: {
                                    type: ["string", "null"],
                                },
                                items: {
                                    type: "array",
                                    items: {
                                        type: "object",
                                        properties: {
                                            name: {
                                                type: ["string", "null"],
                                            },
                                            quantity: {
                                                type: ["number", "null"],
                                            },
                                            price: {
                                                type: ["number", "null"],
                                            },
                                        },
                                        required: [
                                            "name",
                                            "quantity",
                                            "price",
                                        ],
                                        additionalProperties: false,
                                    },
                                },
                            },
                            required: [
                                "storeName",
                                "purchasedAt",
                                "totalAmount",
                                "currency",
                                "items",
                            ],
                            additionalProperties: false,
                        },
                    },
                },
            });

            const result = JSON.parse(response.output_text);

            return res.json({
                data: result,
            });
        } catch (error) {
            console.error(error);

            return res.status(500).json({
                message: "이미지 분석 중 오류가 발생했습니다.",
            });
        }
    },
);

app.use((error, req, res, next) => {
    if (error instanceof multer.MulterError) {
        return res.status(400).json({
            message: "이미지 업로드 조건을 확인해 주세요.",
        });
    }

    return res.status(400).json({
        message: error.message,
    });
});

app.listen(3000, () => {
    console.log("Server running on port 3000");
});