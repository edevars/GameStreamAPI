const MongoLib = require('../lib/mongo');
const bcrypt = require('bcrypt');

class UserService {
  constructor() {
    this.collection = 'users';
    this.mongoDB = new MongoLib();
  }

  async getUser({ email }) {
    const [user] = await this.mongoDB.getAll(this.collection, { email });
    return user;
  }

  async createUser({ user }) {
    const { password } = user;

    const hashedPassword = await bcrypt.hash(password, 10);
    const createdUserId = await this.mongoDB.create(this.collection, {
      ...user,
      password: hashedPassword
    });

    return createdUserId;
  }

  async verifyUserExists({ email }) {
    const [user] = await this.mongoDB.getAll(this.collection, { email });
    return user;
  }
}

module.exports = UserService;
