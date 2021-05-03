const express = require('express');
const morgan = require('morgan');
const fileUpload = require('express-fileupload');
const path = require('path');


const notFounHandler = require('./utils/middleware/notFounHandler');
const cors = require("cors");



const app = express();
app.use(express.static(path.join(__dirname, 'public')));

const { config } = require('./config/index');

//Require routes
const gamesApi = require('./routes/api/games');
const gamesRender = require('./routes/render/games')
const apiDocs = require('./routes/render/api-docs');


const {
  logErrors,
  errorHandler,
  wrapErrors
} = require('./utils/middleware/errorHandler');

//To upload files
app.use(fileUpload());

//enabling cors
app.use(cors());

//body-parser
app.use(express.json());

//Loger to http requests
app.use(morgan('combined'))

//adding routes
gamesApi(app)

// Application
gamesRender(app)
apiDocs(app)

//catch error 404
app.use(notFounHandler);

//Error handling
app.use(logErrors);
app.use(wrapErrors);
app.use(errorHandler);

//set views
app.set("views", path.join(__dirname,"views"))
app.set("view engine","pug")



app.listen(config.port, () => {
  const debug = require("debug")("app:server");
  debug(`Listening http://localhost:${config.port}`);
});
