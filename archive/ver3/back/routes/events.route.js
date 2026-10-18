const router = require('express').Router()

const eventsService = require('./events.service')
const gamesService = require('./games.service')
const { isValidEventDate } = require('./events.validation')

router.get('/eventList', async (req, res) => {
    try {
        const result = await eventsService.eventList()

        res.json(result)

    } catch (err) {
        res.status(500).json({
            message: err.message
        })
    }
})

router.get('/:eventId', async (req, res) => {
    try {
        const { eventId } = req.params

        const eventInfo = await eventsService.eventInfo(eventId)
        if (!eventInfo) return res.status(404).json({ message: '해당 이벤트를 찾을 수 없습니다.' })
        const records = gamesService.eventRecords(eventId)

        res.json({ eventInfo, records: records })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

router.delete('/:eventId', async (req, res) => {
    try {
        const { eventId } = req.params

        const result = eventsService.deleteEvent(eventId)
        if (!result) return res.status(404).json({ message: '해당 이벤트를 찾을 수 없습니다.' })
        res.json({ result })
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: err.message })
    }
})

router.post('/save', async (req, res) => {
    try {
        const result = eventsService.saveEvent(req.body)
        return res.json({ message: 'success', result })
    } catch (err) {
        if (err.status !== 400) console.error(err)
        return res.status(err.status === 400 ? 400 : 500).json({
            message: err.status === 400 ? err.message : '이벤트 저장 중 오류가 발생했습니다.'
        })
    }
})

router.post('/modify', async function modifyEvent(req, res) {
    const { eventId, title, date, eventType, pattern, center } = req.body || {}

    if (typeof eventId !== 'string' || !eventId.trim() ||
        typeof title !== 'string' || !title.trim() ||
        typeof pattern !== 'string' || typeof center !== 'string') {
        return res.status(400).json({
            message: 'eventId와 title은 비어 있지 않은 문자열이며, pattern과 center는 문자열로 입력해야 합니다.'
        })
    }

    if (!isValidEventDate(date)) {
        return res.status(400).json({ message: 'date는 YYYY-MM-DD 형식의 유효한 날짜여야 합니다.' })
    }

    if (![true, false, 0, 1].includes(eventType)) {
        return res.status(400).json({ message: 'eventType은 boolean 또는 숫자 0, 1이어야 합니다.' })
    }

    try {
        const event = await eventsService.modifyEvent({
            eventId, title, date, eventType: Number(eventType), pattern, center
        })

        if (!event) {
            return res.status(404).json({ message: '해당 eventId의 이벤트를 찾을 수 없습니다.' })
        }

        return res.json(event)
    } catch (err) {
        console.error(err)
        return res.status(500).json({ message: '이벤트 수정 중 오류가 발생했습니다.' })
    }
})

module.exports = router