const express = require('express');
const passport = require('passport');
const boom = require('@hapi/boom');
const jwt = require('jsonwebtoken');


const ApiKeysService = require('../../services/apiKeys');
const UsersServices = require('../../services/users');
const validationHandler = require('../../utils/middleware/validationHandler');
const uploadDropboxImage = require('../../utils/uploadDropboxImage');


const { createdUser } = require('../../schemas/user');

const { config } = require('../../config');

//Basic strategy

require('../../utils/auth/basic');



function AuthApi(app) {
  const router = express.Router();
  app.use('/api/auth', router);

  const apiKeyService = new ApiKeysService();
  const userService = new UsersServices();

  /**
   * @openapi
  * components:
   *   securitySchemes:
   *     BasicAuth:
   *       type: http
   *       scheme: basic
   * 
   * security:
   *   - BasicAuth: []
   * /api/auth/sign-in:
   *   post:
   *     description: Sign in endpoint
   *     requestBody:
   *        content:
   *          application/json:
   *               schema:
   *                type: object
   *                properties:
   *                  apiKeyToken:
   *                      type: string
   * 
   *     responses:
   *       201:
   *         description: Return the user and token after sign in
   * 
  
  
   */
  router.post('/sign-in', async function (req, res, next) {
    const { apiKeyToken } = req.body;
    if (!apiKeyToken) {
      next(boom.unauthorized('apiKeyToken is required'));
    }

    passport.authenticate('basic', function (error, user) {
      try {
        if (error || !user) {
          next(boom.unauthorized('User or password are incorrect'));
        } else {
          req.login(user, { session: false }, async function (error) {
            if (error) {
              next(error);
            }

            const apiKey = await apiKeyService.getApiKey({ token: apiKeyToken });

            if (!apiKey) {
              next(boom.unauthorized('API Key not found or is incorrect. Pleace check if you have a valid API token'));
            } else {
              const { _id: id, email, publicImageUrl } = user;

              const payload = {
                sub: id,
                email,
                scopes: apiKey.scopes
              };

              const token = jwt.sign(payload, config.authJwtSecret);

              return res
                .status(201)
                .json({ token, user: { id, email, publicImageUrl } });
            }
          });
        }


      } catch (error) {
        next(error);
      }
    })(req, res, next);
  });
  /**
   * @openapi
   * /api/auth/sign-up:
   *   post:
   *     description: Sign in endpoint
   *     requestBody:
   *        content:
   *          multipart/form-data:
   *            schema:
   *              type: object
   *              properties:
   *                avatar:
   *                   type: string
   *                   format: binary
   *                email:
   *                   type: string
   *                password:
   *                   type: string
   *     responses:
   *       201:
   *         description: Return the message that user was created
   */
  router.post('/sign-up', validationHandler(createdUser), async function (req, res, next) {

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

        if (createdUserId) {
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
