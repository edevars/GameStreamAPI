const GameService = require('../../services/game')

function GamesRender(app) {
    const gameService = new GameService()

    app.get('/', async function (req, res, next) {
        try {
            const games = await gameService.getGames()
            res.render("games", { games })
        } catch (error) {
            next(error)
        }
    })
}

module.exports = GamesRender