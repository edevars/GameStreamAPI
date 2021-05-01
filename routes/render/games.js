const { Router } = require('express')
const GameService = require('../../services/game')

function GamesRender(app) {
    const router = new Router()
    const gameService = new GameService()

    app.use('/games', router)

    router.get('/', async function (req, res, next) {
        try {
            const games = await gameService.getGames()
            res.render("games", { games })
        } catch (error) {
            next(error)
        }
    })
}

module.exports = GamesRender