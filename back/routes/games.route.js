const express = require('express')
const router = express.Router()
const gamesService = require('./games.service')

const isValidDate = (value) => {
    if (typeof value !== 'string' || !/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/.test(value)) {
        return false
    }

    const date = new Date(`${value}T00:00:00.000Z`)
    return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value
}

router.post('/save', async function savePersonalGames(req, res) {
    const { memberId, date, center, scores } = req.body || {}

    if (!Number.isSafeInteger(memberId) || memberId <= 0) {
        return res.status(400).json({ message: 'memberId는 양의 정수여야 합니다.' })
    }
    if (!isValidDate(date)) {
        return res.status(400).json({ message: 'date는 YYYY-MM-DD 형식의 유효한 날짜여야 합니다.' })
    }
    if (typeof center !== 'string' || !center.trim()) {
        return res.status(400).json({ message: 'center는 비어 있지 않은 문자열이어야 합니다.' })
    }
    if (!Array.isArray(scores) || scores.length === 0 ||
        !scores.every(game => game && typeof game === 'object' &&
            Number.isSafeInteger(game.gameNumber) && game.gameNumber > 0 &&
            Number.isInteger(game.score) && game.score >= 0 && game.score <= 300)) {
        return res.status(400).json({ message: 'scores는 양의 정수 gameNumber와 0~300 정수 score를 가진 객체를 한 개 이상 포함해야 합니다.' })
    }
    if (new Set(scores.map(game => game.gameNumber)).size !== scores.length) {
        return res.status(400).json({ message: 'gameNumber는 요청 내에서 중복될 수 없습니다.' })
    }

    try {
        const games = gamesService.savePersonalGames({ memberId, date, center: center.trim(), scores })
        return res.status(201).json({ games })
    } catch (err) {
        if (err.status === 400) return res.status(400).json({ message: err.message })
        console.error(err)
        return res.status(500).json({ message: '개인 게임 기록 저장 중 오류가 발생했습니다.' })
    }
})

router.get('/grade-statistics', async function getGradeStatistics(req, res) {
    const year = req.query.year === undefined ? '2026' : req.query.year

    if (typeof year !== 'string' || !/^[0-9]{4}$/.test(year) || Number(year) < 1 || Number(year) > 9998) {
        return res.status(400).json({ message: 'year는 0001부터 9998까지의 네 자리 연도여야 합니다.' })
    }

    try {
        const result = await gamesService.getGradeStatistics(Number(year))
        return res.json(result)
    } catch (err) {
        console.error(err)
        return res.status(500).json({ message: '등급별 게임 통계 조회 중 오류가 발생했습니다.' })
    }
})

router.get('/:memberId', async function getMemberGames(req, res) {
    const { memberId } = req.params
    const { start, end } = req.query

    if (!/^[0-9]+$/.test(memberId) || !Number.isSafeInteger(Number(memberId)) || Number(memberId) <= 0) {
        return res.status(400).json({ message: 'memberId는 양의 정수여야 합니다.' })
    }

    if (!isValidDate(start) || !isValidDate(end)) {
        return res.status(400).json({ message: 'start와 end는 YYYY-MM-DD 형식의 유효한 날짜로 입력해야 합니다.' })
    }

    // SQLite cannot represent the day after 9999-12-31 for the exclusive upper bound.
    if (end === '9999-12-31') {
        return res.status(400).json({ message: 'end는 9999-12-30 이하의 날짜여야 합니다.' })
    }

    if (start > end) {
        return res.status(400).json({ message: 'start는 end보다 늦을 수 없습니다.' })
    }

    try {
        const result = await gamesService.getMemberGames(Number(memberId), start, end)
        return res.json({ games: result })
    } catch (err) {
        console.error(err)
        return res.status(500).json({ message: '회원 게임 기록 조회 중 오류가 발생했습니다.' })
    }
})

module.exports = router
