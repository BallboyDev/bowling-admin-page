const express = require('express')
const router = express.Router()

const recordsService = require('./records.service')
const eventsService = require('./events.service')


router.get('/', async (req, res) => {
    try {
        const result = await recordsService.records(req, res)

        res.json(result)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

module.exports = router