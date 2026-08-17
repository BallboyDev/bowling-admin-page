const express = require('express')
const router = express.Router()

const openaiService = require('./openai.service')
const membersService = require('./members.service')
// const imagesService = require('./images.service')
const { uploadMemory } = require('./images.service')

router.post('/', async (req, res) => {

    const result = process.env.OPENAI_API_KEY
    // const result = await openaiService.test1(req, res)

    res.json(result)
})

router.post('/analysis', uploadMemory.single("image"), async (req, res) => {
    try {

        const file = req.file



        // 1. memberList 조회
        const temp = await membersService.members()
        const memberList = temp.map((v) => {
            console.log(v)
            return v.name
        })

        // 2. 이미지 분석
        const analysis = await openaiService.imageAnalysis(file, memberList)

        res.json(analysis)

    } catch (err) {
        console.error(err)
        res.status(500).json(err)
    }
})

module.exports = router