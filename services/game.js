const MongoLib = require('../lib/mongo');

class CategoryService {
  constructor() {
    this.collection = 'games';
    this.mongoDB = new MongoLib();
  }

  async getGames() {
    const games = await this.mongoDB.getAll(this.collection);
    return games;
  }

  async createGame({ game }) {
    const createdGameId = await this.mongoDB.create(
      this.collection,
      game
    );

    return createdGameId;
  }

  async deleteCategory({ gameId }) {
    const deletedGameId = await this.mongoDB.delete(
      this.collection,
      gameId
    );

    return deletedGameId;
  }
}

module.exports = CategoryService;
