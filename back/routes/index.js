const express = require('express');
const router = express.Router();
const memberRoute = require('./members.route');
const recordsRoute = require('./records.route')
const openaiRoute = require('./openai.route')

router.use('/members', memberRoute);

router.use('/records', recordsRoute)

router.use('/openai', openaiRoute)

module.exports = router;