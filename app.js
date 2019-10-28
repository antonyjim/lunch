/**
 * Contains the entry point to the app
 */

require('dotenv/config')
const fs = require('fs')
const path = require('path')
const express = require('express')
const bodyParser = require('body-parser')

const router = require('./routes')

const app = express()

const listenPort = parseInt(process.env.PORT, 10) || 80

app.use('/public', express.static(path.join(__dirname + '/public')))
app.use(bodyParser.json())
app.use('/api', router)
app.get('/', (req, res) => {
  res.writeHead(200, {
    'Content-Type': 'text/html'
  })
  fs.createReadStream(path.join(__dirname + '/index.html')).pipe(res)
})

app.listen(listenPort, () => {
  console.log('Listening on %d', listenPort)
})
