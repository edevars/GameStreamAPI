const express = require('express');
const passport = require('passport');
const boom = require('@hapi/boom');
const jwt = require('jsonwebtoken');
const { Dropbox } = require('dropbox');

const ApiKeysService = require('../services/apiKeys');
const UsersServices = require('../services/users');
const validationHandler = require('../utils/middleware/validationHandler');


const { createdUser } = require('../schemas/user');

const { config } = require('../config');

//Basic strategy

require('../utils/auth/basic');

function AuthApi(app) {
  const router = express.Router();
  app.use('/api/auth', router);

  const apiKeyService = new ApiKeysService();
  const userService = new UsersServices();

  router.post('/sign-in', async function (req, res, next) {
    const { apiKeyToken } = req.body;
    if (!apiKeyToken) {
      next(boom.unauthorized('apiKeyToken is required'));
    }

    passport.authenticate('basic', function (error, user) {
      try {
        if (error || !user) {
          next(boom.unauthorized());
        }

        req.login(user, { session: false }, async function (error) {
          if (error) {
            next(error);
          }

          const apiKey = await apiKeyService.getApiKey({ token: apiKeyToken });

          if (!apiKey) {
            next(boom.unauthorized());
          }

          const { _id: id, name, email } = user;

          const payload = {
            sub: id,
            name,
            email,
            scopes: apiKey.scopes
          };

          const token = jwt.sign(payload, config.authJwtSecret, {
            expiresIn: '15'
          });

          res.status(200).json({
            token,
            user: { id, name, email }
          });
        });
      } catch (error) {
        next(error);
      }
    })(req, res, next);
  });

  router.post('/sign-up', validationHandler(createdUser), async function (
    req,
    res,
    next
  ) {

    const { body: user } = req;
    const { avatar } = req.files

    try {
      const userExists = await userService.verifyUserExists(user);

      if (userExists) {
        next(boom.forbidden("Try with another email"))
      }

      // Upload image
      const UPLOAD_FILE_SIZE_LIMIT = 150 * 1024 * 1024;

      if (avatar.size < UPLOAD_FILE_SIZE_LIMIT) {
        const dbx = new Dropbox({ accessToken: config.accessToken });

        dbx.filesUpload({ path: '/users/' + avatar.name, contents: avatar })
          .then(function (response) {
            res.send(response)
          })
          .catch(function (error) {
            next(error);
          });
      }



    } catch (error) {
      next(error);
    }
  });
}

module.exports = AuthApi;
