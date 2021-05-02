const passport = require('passport');
const { Strategy, ExtractJwt } = require('passport-jwt');
const boom = require('@hapi/boom');

const UsersServices = require('../../services/users');
const { config } = require('../../config');

const strategyOptions = {
  secretOrKey: config.authJwtSecret,
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
}

const tokenHandler = async function (tokenPayload, cb) {
  const userService = new UsersServices();
  try {
    const user = await userService.getUser({ email: tokenPayload.email });

    if (!user) {
      return cb(boom.unauthorized(), false);
    }

    delete user.password;

    cb(null, { ...user, scopes: tokenPayload.scopes });
  } catch (error) {
    return cb(error);
  }
}

passport.use(new Strategy(strategyOptions, tokenHandler));
