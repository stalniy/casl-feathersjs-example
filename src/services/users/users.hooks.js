const { hashPassword, protect } = require('@feathersjs/authentication-local').hooks;
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
      protect('password')
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
