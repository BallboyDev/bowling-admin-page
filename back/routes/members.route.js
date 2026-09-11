const express = require('express')
const router = express.Router()

const memberService = require('./members.service')

// 전체 회원 리스트
router.get('/', async (req, res) => {
    const result = await memberService.members()

    res.json(result)
})

// 연도별 회원 통계
router.get('/statistics', async function memberStatistics(req, res) {
    const year = req.query.year === undefined ? '2026' : req.query.year

    if (typeof year !== 'string' || !/^[0-9]{4}$/.test(year) || Number(year) < 1 || Number(year) > 9998) {
        return res.status(400).json({
            message: 'year는 0001부터 9998까지의 네 자리 연도여야 합니다.'
        })
    }

    try {
        const result = await memberService.memberStatistics(Number(year))
        return res.json(result)
    } catch (err) {
        console.error(err)
        return res.status(500).json({ message: '회원 통계 조회 중 오류가 발생했습니다.' })
    }
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
