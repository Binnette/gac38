const axios = require('axios')
const apiTelegram = 'http://api.telegram.org/'
const bot = process.env.TELEGRAM_BOT_ID
const channel = process.env.TELEGRAM_CHANNEL_ID
//DEBUG ONLY
//process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0

var self = {

    postMessageOnTelegram: (mess, res) => {
        var encodedMess = encodeURIComponent(mess)
        console.log("Encoded message: " + encodedMess)
        var url = apiTelegram + 'bot' + bot + '/sendMessage?chat_id=' + channel + '&text=' + encodedMess

        axios
            .get(url)
            .then(response => {
                console.log('✔ Telegram succes: ' + response.status)
                return res.status(200).json({ status: '✔ Event posted!' })
            })
            .catch(error => {
                console.log('❌ Telegram error:')
                console.error(error)
                if (error) {
                    if (error.code === 'ETIMEDOUT') {
                        return res.status(500).json({ error: '❌ Telegram error: timeout' })
                    }
                    return res.status(500).json({ error: '❌ Telegram error: ' + error.code })
                }
                return res.status(500).json({ error: '❌ Unknow error' })
            })
    },

    postCustomEvent: (req, res) => {

        if (!bot) {
            return res.status(400).json({ error: '❌ Server error', reason: 'TELEGRAM_BOT_ID is not configured' })
        }

        if (!channel) {
            return res.status(400).json({ error: '❌ Server error', reason: 'TELEGRAM_CHANNEL_ID is not configured' })
        }

        var icon = req.body.icon
        var title = req.body.title
        var date = req.body.date
        var time = req.body.time
        var location = req.body.location
        var username = req.body.username
        var description = req.body.description

        if (!icon || icon.length < 1) {
            icon = '⭐'
        }
        if (icon.length > 2) {
            icon = '⭐'
        }

        if (!title || title.length < 4) {
            return res.status(400).json({ error: '❌ Title is mandatory' })
        }

        if (!date || date.length < 10) {
            return res.status(400).json({ error: '❌ Date is mandatory' })
        }

        if (!time || time.length < 3) {
            return res.status(400).json({ error: '❌ Time is mandatory' })
        }

        var regTime = '^[0-9]{1,2}(?:\:[0-5][0-9]){0,1}[a|p]m$';
        if (!time.match(regTime)) {
            return res.status(400).json({ error: '❌ Time must match 10am, 8pm, 1:30pm, ...' });
        }

        if (!location || location.length < 3) {
            return res.status(400).json({ error: '❌ Location is mandatory' })
        }

        if (!username || location.username < 3) {
            return res.status(400).json({ error: '❌ Your name is mandatory' })
        }

        var mess = icon + " " + title + " " + icon
        mess += "\n📅 " + date + " " + time
        mess += "\n📍 " + location
        mess += "\n😁 Proposed by: " + username

        if (description && description.length > 4) {
            mess += "\n\n" + description
        }

        self.postMessageOnTelegram(mess, res)

    },

    postMeetupEvent: (req, res) => {

    }
}

module.exports = self