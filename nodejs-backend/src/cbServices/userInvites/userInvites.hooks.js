const {
  encryptResponse,
  decryptRequest,
  decryptResponse,
} = require("../../utils/encryption");

module.exports = {
  before: {
    all: [],
    find: [decryptRequest],
    get: [decryptRequest],
    create: [decryptRequest],
    update: [decryptRequest],
    patch: [decryptRequest],
    remove: [],
  },
  after: {
    all: [encryptResponse],
    find: [decryptResponse, encryptResponse],
    get: [decryptResponse, encryptResponse],
    create: [encryptResponse],
    update: [encryptResponse],
    patch: [encryptResponse],
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
