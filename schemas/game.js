const joi = require('@hapi/joi')

const gameIdModel = joi.string().regex(/^[0-9a-fA-F]{24}/);

const game = joi.object({
    title: joi.string().required(),
    studio: joi.string().required(),
    contentRaiting: joi.string().required(),
    publicationYear: joi.number().min(1960).max(2022).required(),
    description: joi.string().required(),
    platforms: joi.array().items(joi.string().required()).required(),
    tags: joi.array().items(joi.string().required()).required(),
    galleryImages: joi.array().items(joi.string().uri().required()).required(),
}).required()

const createdGames = joi.array().items(game).required()

// const testGames = [
//     {
//         title: "The Witcher 3: Wild Hunt",
//         studio: "CD Project Red",
//         contentRaiting: "PGI 18",
//         publicationYear: "2015",
//         description: "As war rages on throughout the Northern Realms, you take on the greatest contract of your life — tracking down the Child of Prophecy, a living weapon that can alter the shape of the world.",
//         platforms: ["PC", "Playstation 4", "Xbox One"],
//         tags: ["RPG", "Action", "Open World"],
//         galleryImages: [
//             "https://cdn.cloudflare.steamstatic.com/steam/apps/292030/ss_107600c1337accc09104f7a8aa7f275f23cad096.600x338.jpg",
//             "https://cdn.cloudflare.steamstatic.com/steam/apps/292030/ss_ed23139c916fdb9f6dd23b2a6a01d0fbd2dd1a4f.600x338.jpg",
//             "https://cdn.cloudflare.steamstatic.com/steam/apps/292030/ss_908485cbb1401b1ebf42e3d21a860ddc53517b08.600x338.jpg"
//         ]
//     }
// ]

// console.log(createdGames.validate(testGames))


module.exports = { gameIdModel, createdGames };
