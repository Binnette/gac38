const express = require('express')
const router = express.Router()
const eventService = require('../services/event.service')

router.post('/', eventService.postEvent)
module.exports = router
