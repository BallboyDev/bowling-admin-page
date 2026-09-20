const express = require('express');
const router = express.Router();
const eventsRoute = require('./events.route')
const membersRoute = require('./members.route');
const openaiRoute = require('./openai.route')
const imagesRouter = require('./images.route')
const gamesRoute = require('./games.route')

router.use('/events', eventsRoute)

router.use('/members', membersRoute);

router.use('/games', gamesRoute)

router.use('/openai', openaiRoute)

router.use('/images', imagesRouter)

module.exports = router;