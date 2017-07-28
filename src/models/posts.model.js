module.exports = function (app) {
  const mongooseClient = app.get('mongooseClient');
  const { Schema } = mongooseClient;
  const Post = new Schema({
    author: { type: Schema.Types.ObjectId, ref: 'users', required: true },
    title: { type: String, required: true },
    text: { type: String, required: true }
  }, {
    timestamps: true
  });

  return mongooseClient.model('Post', Post);
};
