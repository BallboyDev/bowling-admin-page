const express = require('express');
const router = express.Router();
const membersRoute = require('./members.route');
const recordsRoute = require('./records.route')
const openaiRoute = require('./openai.route')
const imagesRouter = require('./images.route')

router.use('/members', membersRoute);

router.use('/records', recordsRoute)

router.use('/openai', openaiRoute)

router.use('/images', imagesRouter)

module.exports = router;