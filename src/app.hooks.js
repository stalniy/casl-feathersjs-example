const logger = require('./hooks/logger');
const { when } = require('feathers-hooks-common');
const authorize = require('./hooks/abilities');
const authenticate = require('./hooks/authenticate');

module.exports = {
  before: {
    all: [
      when(
        hook => hook.params.provider && `/${hook.path}` !== hook.app.get('authentication').path,
        authenticate,
        authorize()
      )
    ],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  after: {
    all: [ logger() ],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  error: {
    all: [ logger() ],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
};
