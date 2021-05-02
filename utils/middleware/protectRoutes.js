const passport = require('passport')
const boom = require('@hapi/boom')
require('../auth/jwt')

const protectRoutes = (req, res, next) => {
    passport.authenticate('jwt', (error, user) => {
        console.log(user)
        if (error || !user) return next(boom.unauthorized('Not authorized user'))

        req.login(user, { session: false }, (err) => {
            if (err) return next(err)
            next()
        })
    })(req, res, next)
}

module.exports = protectRoutes