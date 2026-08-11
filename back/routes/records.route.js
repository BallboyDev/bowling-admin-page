const express = require('express')
const router = express.Router()

const recordsService = require('./records.service')

router.get('/', async (req, res) => {
    const result = await recordsService.records(req, res)

    res.json(result)
})

router.get('/gameList', async (req, res) => {
    const result = await recordsService.gameList(req, res)

    res.json(result)
})

router.get('/:id', async (req, res) => {
    const result = await recordsService.gameInfo(req, res)

    res.json(result)
})

module.exports = router