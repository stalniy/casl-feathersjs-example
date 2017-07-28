module.exports = function (app) {
  const mongooseClient = app.get('mongooseClient');
  const User = new mongooseClient.Schema({
    email: { type: String, unique: true },
    password: { type: String }
  }, {
    timestamps: true
  });

  return mongooseClient.model('User', User);
};
