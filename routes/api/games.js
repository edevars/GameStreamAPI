const express = require('express');
const passport = require('passport');
const { createdGames } = require('../../schemas/game')
const GameService = require('../../services/game');
const validationHandler = require('../../utils/middleware/validationHandler');
const scopesValidationHandler = require('../../utils/middleware/scopesValidationHandler');

require('../../utils/auth/jwt')


function GamesApi(app) {
    const router = express.Router();
    app.use('/api/games', router);

    const gameService = new GameService()

    router.post('/',
        scopesValidationHandler(['create:game']),
        validationHandler(createdGames),
        async function (req, res, next) {
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
        async function (req, res, next) {
            try {
                const games = await gameService.getGames()

                res.status(200).json({
                    games
                })
            } catch (error) {
                next(error)
            }
        })

    /**
     * @openapi
     * /api/games/search?contains=:
     *   get:
     *     description: Return an array of games searched by title
     *     parameters:
     *      - name: termOfSearch
     *        in: string
     *        description: The term of search by title
     *        schema:
     *          type: string
     *          maximum: 1
     *     responses:
     *       200:
     *         description: Return the search match by title.
     */
    router.get('/search',
        async function (req, res, next) {

            const { contains } = req.query
            const searchString = contains.toLowerCase()
            try {

                const results = await gameService.searchGameByTitle(searchString)

                res.status(200).json({
                    results
                })
            } catch (error) {
                next(error)
            }
        })
}

module.exports = GamesApi