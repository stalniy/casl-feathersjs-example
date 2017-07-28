module.exports = function (app) {
  const mongooseClient = app.get('mongooseClient');
  const { Schema } = mongooseClient;
  const Comment = new Schema({
    author: { type: Schema.Types.ObjectId, ref: 'users', required: true },
    text: { type: String, required: true },
  }, {
    timestamps: true
  });

  return mongooseClient.model('Comment', Comment);
};
