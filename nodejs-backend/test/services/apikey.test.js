const assert = require("assert");
const app = require("../../src/app");

describe("apikey service", () => {
  let thisService;
  let apikeyCreated;

  beforeEach(async () => {
    thisService = await app.service("apikey");
  });

  it("registered the service", () => {
    assert.ok(thisService, "Registered the service (apikey)");
  });

  describe("#create", () => {
    const options = {"apikey":"new value","projectName":"new value","requests":23,"duration":23,"serviceName":"new value","active":true};

    beforeEach(async () => {
      apikeyCreated = await thisService.create(options);
    });

    it("should create a new apikey", () => {
      assert.strictEqual(apikeyCreated.apikey, options.apikey);
assert.strictEqual(apikeyCreated.projectName, options.projectName);
assert.strictEqual(apikeyCreated.requests, options.requests);
assert.strictEqual(apikeyCreated.duration, options.duration);
assert.strictEqual(apikeyCreated.serviceName, options.serviceName);
assert.strictEqual(apikeyCreated.active, options.active);
    });
  });

  describe("#get", () => {
    it("should retrieve a apikey by ID", async () => {
      const retrieved = await thisService.get(apikeyCreated._id);
      assert.strictEqual(retrieved._id, apikeyCreated._id);
    });
  });

  describe("#update", () => {
    let apikeyUpdated;
    const options = {"apikey":"updated value","projectName":"updated value","requests":100,"duration":100,"serviceName":"updated value","active":false};

    beforeEach(async () => {
      apikeyUpdated = await thisService.update(apikeyCreated._id, options);
    });

    it("should update an existing apikey ", async () => {
      assert.strictEqual(apikeyUpdated.apikey, options.apikey);
assert.strictEqual(apikeyUpdated.projectName, options.projectName);
assert.strictEqual(apikeyUpdated.requests, options.requests);
assert.strictEqual(apikeyUpdated.duration, options.duration);
assert.strictEqual(apikeyUpdated.serviceName, options.serviceName);
assert.strictEqual(apikeyUpdated.active, options.active);
    });
  });

  describe("#delete", () => {
  let apikeyDeleted;
    beforeEach(async () => {
      apikeyDeleted = await thisService.remove(apikeyCreated._id);
    });

    it("should delete a apikey", async () => {
      assert.strictEqual(apikeyDeleted._id, apikeyCreated._id);
    });
  });
});