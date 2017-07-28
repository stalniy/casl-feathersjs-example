const { authenticate } = require('feathers-authentication').hooks;
const { when } = require('feathers-hooks-common');

module.exports = {
  before: {
    all: [
      when(hook => hook.method !== 'find', authenticate('jwt'))
    ],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
};
