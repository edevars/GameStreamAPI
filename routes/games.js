const express = require('express');
const GameService = require('../services/game');
const { createdGames } = require('../schemas/game')
const validationHandler = require('../utils/middleware/validationHandler');


function GamesApi(app) {
    const router = express.Router();
    app.use('/api/games', router);

    const gameService = new GameService()

    router.post('/', validationHandler(createdGames), async function (req, res, next) {
        const { body: games } = req

        try {
            const insertedIds = await gameService.createGames({ games })

            res.status(201).json({
                insertedIds
            })
        } catch (error) {
            next(error)
        }
    })
}

module.exports = GamesApi