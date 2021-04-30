const express = require('express');
const passport = require('passport');
const boom = require('@hapi/boom');
const jwt = require('jsonwebtoken');


const ApiKeysService = require('../services/apiKeys');
const UsersServices = require('../services/users');
const validationHandler = require('../utils/middleware/validationHandler');
const uploadDropboxImage = require('../utils/uploadDropboxImage');


const { createdUser } = require('../schemas/user');

const { config } = require('../config');
const { response } = require('express');
const { use } = require('passport');

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

          const { _id: id, email } = user;

          const registeredUser = await userService.getUser({ email })
          
          delete registeredUser.password

          const payload = {
            sub: id,
            email,
            scopes: apiKey.scopes
          };

          const token = jwt.sign(payload, config.authJwtSecret, {
            expiresIn: '15'
          });

          res.status(200).json({
            token,
            user: registeredUser
          });
        });
      } catch (error) {
        next(error);
      }
    })(req, res, next);
  });

  router.post('/sign-up', async function (req, res, next) {

    const { body: user } = req;
    const { avatar } = req.files

    try {
      const userExists = await userService.verifyUserExists(user);

      if (userExists) {
        next(boom.forbidden("Try with another email"))
      } else {
        const completeUser = {
          email: user.email,
          password: user.password,
          favorites: []
        }

        const createdUserId = await userService.createUser({ user: completeUser })

        if (createdUser) {
          const publicImageUrl = await uploadDropboxImage(req, res, next, avatar)
          const userUpdated = await userService.updateUser({ id: createdUserId, data: { publicImageUrl } })
          if (userUpdated) {
            res.status(201).json({
              id: createdUserId,
              message: "User created succesfully"
            })
          }
        } else {
          next(boom.Boom("Something went wrong"))
        }

      }

    } catch (error) {
      next(error);
    }
  });
}

module.exports = AuthApi;
