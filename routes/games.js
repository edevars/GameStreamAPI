const express = require('express');
const passport = require('passport');
const boom = require('@hapi/boom');


const GameService = require('../services/game');
const { createdGames, gameIdModel } = require('../schemas/game')
const validationHandler = require('../utils/middleware/validationHandler');


function GamesApi(app) {
    const router = express.Router();
    app.use('/api/games', router);

    const gameService = new GameService()

    router.post('/', validationHandler(createdGames), async function (req, res, next) {
        const { body } = req
        
        res.send(body)
    })
}

module.exports = GamesApi