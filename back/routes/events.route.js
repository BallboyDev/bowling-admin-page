const router = require('express').Router()

const eventsService = require('./events.service')
const recordsService = require('./records.service')
const gamesService = require('./games.service')

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
        const records = await recordsService.recordList(eventId)

        res.json({ eventInfo, records: records })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

router.delete('/:eventId', async (req, res) => {
    try {
        const { eventId } = req.params

        const eventResult = await eventsService.deleteEvent(eventId)
        const recordResult = await recordsService.deleteRecordByEventId(eventId)
        const gameResult = await gamesService.deleteGameByEventId(eventId)
        res.json({ result: { eventResult, recordResult, gameResult } })
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: err.message })
    }
})

router.post('/save', async (req, res) => {
    try {
        const { records, title, date, mainGame, pattern, lotto } = req.body

        const eventId = await eventsService.saveEvent(title, date, mainGame, records, pattern, lotto)

        const recordResult = await recordsService.saveRecords(eventId, date, title, records, mainGame)

        const gameResult = []
        recordResult.forEach(async (gameData) => {
            const temp = await gamesService.saveGames(gameData, date)
            gameResult.push(...temp)
        });



        res.json({ message: 'success', result: { recordResult, gameResult } })
    } catch (err) {
        res.status(500).json({
            message: err.message
        })
    }
})

module.exports = router