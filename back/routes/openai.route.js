const express = require('express')
const router = express.Router()

const openaiService = require('./openai.service')
const membersService = require('./members.service')
// const imagesService = require('./images.service')
const { uploadMemory } = require('./images.service')

router.post('/', async (req, res) => {

    // const result = process.env.OPENAI_API_KEY
    // const result = await openaiService.test1(req, res)

    // res.json(result)
})

router.post('/analysis', uploadMemory.single("image"), async (req, res) => {
    try {

        const file = req.file

        if (!file) {
            return res.status(400).json({
                message: '분석할 이미지 누락'
            })
        }

        // 1. memberList 조회
        const temp = await membersService.members()
        const memberList = temp.map((v) => {
            return v.name
        })

        // 2. 이미지 분석
        const analysis = await openaiService.imageAnalysis(file, memberList)
        console.log(analysis)

        res.json(analysis)

    } catch (err) {
        console.error(err)
        res.status(500).json(err)
    }
})

module.exports = router


const analysis1 = {
    "action": {
        "players": [
            {
                "name": "양승우",
                "game1": "*159",
                "game2": "*225",
                "game3": "*198",
                "game4": "*196"
            },
            {
                "name": "이정섭",
                "game1": "226",
                "game2": "250",
                "game3": "195",
                "game4": "192"
            },
            {
                "name": "형지영",
                "handicap": 15,
                "game1": "X",
                "game2": "*110",
                "game3": "*128",
                "game4": "*89"
            },
            {
                "name": "박남석",
                "game1": "168",
                "game2": "203",
                "game3": "179",
                "game4": "180"
            },
            {
                "name": "이무석",
                "game1": "199",
                "game2": "245",
                "game3": "173",
                "game4": "172"
            },
            {
                "name": "전주원",
                "game1": "177",
                "game2": "154",
                "game3": "143",
                "game4": "153"
            },
            {
                "name": "한미화",
                "handicap": 15,
                "game1": "X",
                "game2": "X",
                "game3": "220",
                "game4": "164"
            },
            {
                "name": "심대승",
                "game1": "X",
                "game2": "X",
                "game3": "177",
                "game4": "170"
            },
            {
                "name": "유제민",
                "game1": "X",
                "game2": "194",
                "game3": "132",
                "game4": "180"
            },
            {
                "name": "김미옥",
                "handicap": 15,
                "game1": "X",
                "game2": "183",
                "game3": "156",
                "game4": "179"
            },
            {
                "name": "유기환",
                "game1": "183",
                "game2": "206",
                "game3": "148",
                "game4": "187"
            },
            {
                "name": "정귀진",
                "game1": "201",
                "game2": "205",
                "game3": "192",
                "game4": "160"
            }
        ]
    }
}

const temp = {
    action: {
        players: [{
            name: '양승우',
            handicap: 0,
            game1: {
                acc: true,
                score: 167
            },
            game2: {
                acc: true,
                score: 144
            },
            game3: {
                acc: true,
                score: 152
            },
            game4: {
                acc: false,
                score: 157
            },
        }, {
            name: '한미화',
            handicap: 15,
            game1: {
                acc: true,
                score: 200
            },
            game2: {
                acc: true,
                score: 150
            },
            game3: {
                acc: true,
                score: 250
            },
            game4: {
                acc: true,
                score: 100
            }
        }, {
            name: '전형서',
            handicap: 0,
            game1: {
                acc: true,
                score: 0
            },
            game2: {
                acc: true,
                score: 0
            },
            game3: {
                acc: true,
                score: 0
            },
            game4: {
                acc: true,
                score: 0
            }
        }, {
            name: '최민우',
            handicap: 0,
            game1: {
                acc: true,
                score: 0
            },
            game2: {
                acc: true,
                score: 0
            },
            game3: {
                acc: true,
                score: 0
            },
            game4: {
                acc: true,
                score: 0
            }
        }, {
            name: '정귀진',
            handicap: 0,
            game1: {
                acc: true,
                score: 0
            },
            game2: {
                acc: true,
                score: 0
            },
            game3: {
                acc: true,
                score: 0
            },
            game4: {
                acc: true,
                score: 0
            }
        }, {
            name: '유기환',
            handicap: 0,
            game1: {
                acc: true,
                score: 0
            },
            game2: {
                acc: true,
                score: 0
            },
            game3: {
                acc: true,
                score: 0
            },
            game4: {
                acc: true,
                score: 0
            }
        }, {
            name: '이정섭',
            handicap: 0,
            game1: {
                acc: true,
                score: 0
            },
            game2: {
                acc: true,
                score: 0
            },
            game3: {
                acc: true,
                score: 0
            },
            game4: {
                acc: true,
                score: 0
            }
        }, {
            name: '이무석',
            handicap: 0,
            game1: {
                acc: true,
                score: 0
            },
            game2: {
                acc: true,
                score: 0
            },
            game3: {
                acc: true,
                score: 0
            },
            game4: {
                acc: true,
                score: 0
            }
        }, {
            name: '박남석',
            handicap: 0,
            game1: {
                acc: true,
                score: 0
            },
            game2: {
                acc: true,
                score: 0
            },
            game3: {
                acc: true,
                score: 0
            },
            game4: {
                acc: true,
                score: 0
            }
        }, {
            name: '전주원',
            handicap: 0,
            game1: {
                acc: true,
                score: 0
            },
            game2: {
                acc: true,
                score: 0
            },
            game3: {
                acc: true,
                score: 0
            },
            game4: {
                acc: true,
                score: 0
            }
        }, {
            name: '유제민',
            handicap: 0,
            game1: {
                acc: true,
                score: 0
            },
            game2: {
                acc: true,
                score: 0
            },
            game3: {
                acc: true,
                score: 0
            },
            game4: {
                acc: true,
                score: 0
            }
        }, {
            name: '형지영',
            handicap: 15,
            game1: {
                acc: true,
                score: 0
            },
            game2: {
                acc: true,
                score: 0
            },
            game3: {
                acc: true,
                score: 0
            },
            game4: {
                acc: true,
                score: 0
            }
        }]
    }
}