const games = require('../../utils/data/games')

function GamesRender(app) {

    app.get('/', function (req, res, next) {
        try {
            
            res.render("games", { games })
        } catch (error) {
            next(error)
        }
    })
}

module.exports = GamesRender