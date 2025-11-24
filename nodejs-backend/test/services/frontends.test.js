const assert = require("assert");
const app = require("../../src/app");

describe("frontends service", () => {
  let thisService;
  let frontendCreated;

  beforeEach(async () => {
    thisService = await app.service("frontends");
  });

  it("registered the service", () => {
    assert.ok(thisService, "Registered the service (frontends)");
  });

  describe("#create", () => {
    const options = {"projectName":"new value","domain":"new value","env":"new value","firebase":"aasdfasdfasdfadsfadfa"};

    beforeEach(async () => {
      frontendCreated = await thisService.create(options);
    });

    it("should create a new frontend", () => {
      assert.strictEqual(frontendCreated.projectName, options.projectName);
assert.strictEqual(frontendCreated.domain, options.domain);
assert.strictEqual(frontendCreated.env, options.env);
assert.strictEqual(frontendCreated.firebase, options.firebase);
    });
  });

  describe("#get", () => {
    it("should retrieve a frontend by ID", async () => {
      const retrieved = await thisService.get(frontendCreated._id);
      assert.strictEqual(retrieved._id, frontendCreated._id);
    });
  });

  describe("#update", () => {
    let frontendUpdated;
    const options = {"projectName":"updated value","domain":"updated value","env":"updated value","firebase":"345345345345345345345"};

    beforeEach(async () => {
      frontendUpdated = await thisService.update(frontendCreated._id, options);
    });

    it("should update an existing frontend ", async () => {
      assert.strictEqual(frontendUpdated.projectName, options.projectName);
assert.strictEqual(frontendUpdated.domain, options.domain);
assert.strictEqual(frontendUpdated.env, options.env);
assert.strictEqual(frontendUpdated.firebase, options.firebase);
    });
  });

  describe("#delete", () => {
  let frontendDeleted;
    beforeEach(async () => {
      frontendDeleted = await thisService.remove(frontendCreated._id);
    });

    it("should delete a frontend", async () => {
      assert.strictEqual(frontendDeleted._id, frontendCreated._id);
    });
  });
});