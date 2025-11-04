const assert = require("assert");
const app = require("../../src/app");

describe("backends service", () => {
  let thisService;
  let backendCreated;

  beforeEach(async () => {
    thisService = await app.service("backends");
  });

  it("registered the service", () => {
    assert.ok(thisService, "Registered the service (backends)");
  });

  describe("#create", () => {
    const options = {"projectName":"new value","port":23,"domain":"new value","env":"new value","frontend":"aasdfasdfasdfadsfadfa","contract":"aasdfasdfasdfadsfadfa","dir":"new value"};

    beforeEach(async () => {
      backendCreated = await thisService.create(options);
    });

    it("should create a new backend", () => {
      assert.strictEqual(backendCreated.projectName, options.projectName);
assert.strictEqual(backendCreated.port, options.port);
assert.strictEqual(backendCreated.domain, options.domain);
assert.strictEqual(backendCreated.env, options.env);
assert.strictEqual(backendCreated.frontend, options.frontend);
assert.strictEqual(backendCreated.contract, options.contract);
assert.strictEqual(backendCreated.dir, options.dir);
    });
  });

  describe("#get", () => {
    it("should retrieve a backend by ID", async () => {
      const retrieved = await thisService.get(backendCreated._id);
      assert.strictEqual(retrieved._id, backendCreated._id);
    });
  });

  describe("#update", () => {
    let backendUpdated;
    const options = {"projectName":"updated value","port":100,"domain":"updated value","env":"updated value","frontend":"345345345345345345345","contract":"345345345345345345345","dir":"updated value"};

    beforeEach(async () => {
      backendUpdated = await thisService.update(backendCreated._id, options);
    });

    it("should update an existing backend ", async () => {
      assert.strictEqual(backendUpdated.projectName, options.projectName);
assert.strictEqual(backendUpdated.port, options.port);
assert.strictEqual(backendUpdated.domain, options.domain);
assert.strictEqual(backendUpdated.env, options.env);
assert.strictEqual(backendUpdated.frontend, options.frontend);
assert.strictEqual(backendUpdated.contract, options.contract);
assert.strictEqual(backendUpdated.dir, options.dir);
    });
  });

  describe("#delete", () => {
  let backendDeleted;
    beforeEach(async () => {
      backendDeleted = await thisService.remove(backendCreated._id);
    });

    it("should delete a backend", async () => {
      assert.strictEqual(backendDeleted._id, backendCreated._id);
    });
  });
});