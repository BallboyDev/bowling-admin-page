const OpenAI = require('openai')

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
})

const test1 = async (req, res) => {
    try {
        const { command } = req.body

        const response = await openai.responses.create({
            model: "gpt-4o-mini",
            input: [
                {
                    role: 'system',
                    content: `
사용자의 명령을 아래 세 가지 동작 중 하나로 분류하세요.

- get_current_time: 현재 시간 요청
- say_hello: 인사 요청
- check_server: 서버 상태 확인
- unknown: 지원하지 않는 요청
                    `
                },
                {
                    role: 'user',
                    content: command,
                }
            ],
            text: {
                format: {
                    type: 'json_schema',
                    name: 'command_result',
                    strict: true,
                    schema: {
                        type: 'object',
                        properties: {
                            action: {
                                type: "string",
                                enum: [
                                    "get_current_time",
                                    'say_hello',
                                    'check_server',
                                    'unknown'
                                ]
                            }
                        },
                        required: ['action'],
                        additionalProperties: false,
                    }
                }
            }
        })

        const { action } = JSON.parse(response.output_text)
        const result = executeAction(action)

        res.json({
            command, action, result
        })
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: '명령 처리 중 오류가 발생했습니다.'
        })
    }
}

const executeAction = (action) => {
    switch (action) {
        case "get_current_time":
            return {
                message: new Date().toLocaleString("ko-KR", {
                    timeZone: "Asia/Seoul",
                }),
            };

        case "say_hello":
            return {
                message: "안녕하세요!",
            };

        case "check_server":
            return {
                message: "서버가 정상적으로 실행 중입니다.",
                uptime: process.uptime(),
            };

        default:
            return {
                message: "지원하지 않는 명령입니다.",
            };
    }
}

const upload = (req, res) => {
    try {
        if (!req.file) {
            res.status(500).json({
                message: '이미지 파일이 필요합니다.'
            })
        }

        const base64Image = req.file.buffer.toString('base64');
        const imageDataUrl = `data:${req.file.mimetype};base64,${base64Image}`;

        console.log(base64Image, imageDataUrl)
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: '명령 처리 중 오류가 발생했습니다.'
        })
    }
}



module.exports = {
    test1,
    upload
}