require('dotenv').config();

const config = {
    accessToken: process.env.DROPBOX_ACCESS_TOKEN,
    port: process.env.PORT
  };
  
  module.exports = { config };
  

