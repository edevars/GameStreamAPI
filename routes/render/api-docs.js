const swaggerJsdoc = require('swagger-jsdoc')
const swaggerUi = require('swagger-ui-express')

function DocsRender(app) {
    const options = {
        definition: {
            openapi: "3.0.0",
            info: {
                title: "GameStream API",
                version: "0.1.0",
                description:
                    "An API developed to consume info about some videogames",
                license: {
                    name: "MIT",
                    url: "https://spdx.org/licenses/MIT.html",
                }
            },
        },
        apis: ["./routes/api/*.js"]
    }

    const specs = swaggerJsdoc(options)
    

    app.use(
        "/api-docs",
        swaggerUi.serve,
        swaggerUi.setup(specs, { explorer: true })
    );
}

module.exports = DocsRender