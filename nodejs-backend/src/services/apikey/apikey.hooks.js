const { authenticate } = require("@feathersjs/authentication").hooks;
const apikeygen = require("../../utils/apikeygen");

module.exports = {
  before: {
    all: [authenticate("jwt"), apikeygen()],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: [],
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: [],
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: [],
  },
};
