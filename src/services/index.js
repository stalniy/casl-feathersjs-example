const users = require('./users/users.service.js');
const comments = require('./comments/comments.service.js');
const posts = require('./posts/posts.service.js');
module.exports = function () {
  const app = this; // eslint-disable-line no-unused-vars
  app.configure(users);
  app.configure(comments);
  app.configure(posts);
};
