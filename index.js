const express = require('express')

const app = express()
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(express.static('public'));
module.exports = app

const event = require('./routes/event')
app.use('/event', event)
