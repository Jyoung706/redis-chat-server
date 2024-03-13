class UserRepository {
  constructor(redis, data) {
    this.redis = redis;
    this.data = data;
  }
}

module.exports = UserRepository;
