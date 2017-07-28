const { hashPassword } = require('feathers-authentication-local').hooks;
const { when, discard } = require('feathers-hooks-common');

module.exports = {
  before: {
    all: [
    ],
    find: [ ],
    get: [ ],
    create: [ hashPassword() ],
    update: [ hashPassword() ],
    patch: [ hashPassword() ],
    remove: [ ]
  },

  after: {
    all: [
      when(hook => hook.params.provider, discard('password'))
    ],
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
