const { authenticate } = require('feathers-authentication').hooks;
const { when, discard } = require('feathers-hooks-common');

const { hashPassword } = require('feathers-authentication-local').hooks;

module.exports = {
  before: {
    all: [
      when(hook => hook.method !== 'create', authenticate('jwt'))
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
