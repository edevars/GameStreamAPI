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

  async createGames({ games }) {
    const createdGameId = await this.mongoDB.createMultiple(
      this.collection,
      games
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
