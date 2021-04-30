const { config } = require('../config');

function cacheResponse(res, seconds) {
  if (config.dev === false) {
    res.set('Cache-Control', `public, max-age=${seconds}`);
  }
}

module.exports = cacheResponse;
