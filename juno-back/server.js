const express = require('express')
const app = express()
const cors = require('cors')
const bodyParser = require('body-parser')
const config = require('config')
const port = process.env.PORT || config.get('server.port')

app.set('port', port)
app.use(cors())
app.use(bodyParser.json());

app.use('/payment', require('./api/routes/payment'));

// RODANDO NOSSA APLICAÇÃO NA PORTA SETADA
app.listen(port);

module.exports = app