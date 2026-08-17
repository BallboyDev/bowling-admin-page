const express = require('express')
const router = express.Router()

const memberService = require('./members.service')

// 전체 회원 리스트
router.get('/', async (req, res) => {
    const result = await memberService.members()

    res.json(result)
})

// 회원 정보 검색
router.get('/:id', async (req, res) => {
    const result = await memberService.memberInfo(req, res)

    res.json(result)
})

// 회원 생성
router.post('/create', async (req, res) => {
    console.log('test route1')

    const result = await memberService.createMember(req, res)
    res.json(result)
})

// 회원 탈퇴
router.delete('/:id', async (req, res) => {
    const result = await memberService.deleteMember(req, res)

    res.json(result)
})

// 회원 정보 수정
router.put('/:id', async (req, res) => {
    console.log('modify info')

    const result = await memberService.modifyMember(req, res)

    res.json(result)
})



module.exports = router