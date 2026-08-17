const express = require('express')
const router = express.Router()

const path = require('path')

const openaiService = require('./openai.service')
const imagesService = require('./images.service')
const membersService = require('./members.service')




router.post('/upload', async (req, res) => {
    //upload.single("image"),
    try {

        // if (!req.file) {
        //     return res.status(400).json({
        //         message: '업로드할 이미지가 없습니다.'
        //     });
        // }

        // const temp = await membersService.members(req, res)
        // const memberList = temp.map((v) => { return v.name })
        // req.body.memberList = JSON.stringify(memberList)

        // const analysis = await openaiService.imagesService(req, res)

        // const result = await imagesService.imageUpload(req, res)

        // res.json(result)

        // 1. 멤버 리스트 조회
    } catch (err) {
        console.error(err)
        res.status(500).json(err)
    }

})

module.exports = router