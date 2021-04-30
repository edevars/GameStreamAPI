const express = require('express');
const morgan = require('morgan');
const fileUpload = require('express-fileupload');

const notFounHandler = require('./utils/middleware/notFounHandler');
const cors = require("cors");



const app = express();

const { config } = require('./config/index');

//Require routes
const authApi = require('./routes/auth');
const gamesApi = require('./routes/games');



const {
  logErrors,
  errorHandler,
  wrapErrors
} = require('./utils/middleware/errorHandler');


app.use(fileUpload());

//enabling cors
app.use(cors());

//body-parser
app.use(express.json());

//Loger to http requests
app.use(morgan('combined'))

//adding routes
authApi(app)
gamesApi(app)

//catch error 404
app.use(notFounHandler);

//Error handling
app.use(logErrors);
app.use(wrapErrors);
app.use(errorHandler);


app.listen(config.port, () => {
  const debug = require("debug")("app:server");
  debug(`Listening http://localhost:${config.port}`);
});
