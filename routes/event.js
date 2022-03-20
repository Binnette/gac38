const express = require('express')
const router = express.Router()
const eventService = require('../services/event.service')

router.post('/custom', eventService.postCustomEvent)
router.post('/meetup', eventService.postMeetupEvent)

module.exports = router
