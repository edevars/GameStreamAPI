const express = require('express');
const path = require('path');
const cors = require("cors");
const helmet = require("helmet");

const app = express();
app.use(express.static(path.join(__dirname, 'public')));

//Require routes
const gamesApi = require('./routes/api/games');
const gamesRender = require('./routes/render/games')
const apiDocs = require('./routes/render/api-docs');


//enabling cors
app.use(cors());

//Securing app
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false,
}))

//body-parser
app.use(express.json());

//adding routes
gamesApi(app)

// Application
gamesRender(app)
apiDocs(app)

//set views
app.set("views", path.join(__dirname,"views"))
app.set("view engine","pug")


const PORT = process.env.NODE_ENV === 'production' ? 80 : 3000

app.listen(PORT, () => {
  const debug = require("debug")("app:server");
  debug(`Listening http://localhost:${PORT}`);
});
