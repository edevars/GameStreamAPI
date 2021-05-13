const express = require('express');
const passport = require('passport');
const { createdGames } = require('../../schemas/game')
const GameService = require('../../services/game');
const validationHandler = require('../../utils/middleware/validationHandler');
const scopesValidationHandler = require('../../utils/middleware/scopesValidationHandler');


require('../../utils/auth/jwt')
const gamesMocked = require('../../utils/data/games');


function GamesApi(app) {
    const router = express.Router();
    app.use('/api/games', router);

    const gameService = new GameService()

    /**
     * @openapi
     * /api/games:
     *   get:
     *     description: Return an array of games
     *     responses:
     *       200:
     *         description: Returns an array of games.
     */
    router.get('/',
        function (req, res, next) {
            try {
                res.status(200).json(gamesMocked)
            } catch (error) {
                next(error)
            }
        })

    /**
     * @openapi
     * /api/games/search:
     *   get:
     *     description: Return an array of games searched by title
     *     parameters:
     *       - in: query
     *         name: contains
     *         schema:
     *          type: string
     *     responses:
     *       200:
     *         description: Return the search match by title.
     */
    router.get('/search',
        async function (req, res, next) {

            const { contains } = req.query
            const searchString = contains.toLowerCase()
            try {

                const results = gamesMocked.filter(game => game.title.toLowerCase().includes(searchString) === true)

                res.status(200).json({
                    results
                })
            } catch (error) {
                next(error)
            }
        })
}

module.exports = GamesApi