const port = process.env.PORT || 1337;
const express = require('express')

const app = express()
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(express.static('public'));

const event = require('./routes/event')
app.use('/event', event)

app.listen(port, (err) => {
    if (err) throw err
    console.log("Server running at http://localhost:%d", port);
})

module.exports = app
