const { config } = require('./config')
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

const app = express()

app.use(cors())
app.use(express.json())
app.use(morgan('combined'))

app.get('/', function (req, res, next) {
    res.status(200).json({
        messaage: "Hola mundo"
    })
})

app.listen(config.port, () => {
    const debug = require("debug")("app:server");
    debug(`Listening http://localhost:${config.port}`);
  });
  