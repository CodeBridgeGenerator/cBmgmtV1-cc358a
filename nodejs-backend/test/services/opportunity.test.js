const assert = require("assert");
const app = require("../../src/app");

describe("opportunity service", () => {
  let thisService;
  let opportunityCreated;

  beforeEach(async () => {
    thisService = await app.service("opportunity");
  });

  it("registered the service", () => {
    assert.ok(thisService, "Registered the service (opportunity)");
  });

  describe("#create", () => {
    const options = {"states":"new value","percentage":23,"status":"new value"};

    beforeEach(async () => {
      opportunityCreated = await thisService.create(options);
    });

    it("should create a new opportunity", () => {
      assert.strictEqual(opportunityCreated.states, options.states);
assert.strictEqual(opportunityCreated.percentage, options.percentage);
assert.strictEqual(opportunityCreated.status, options.status);
    });
  });

  describe("#get", () => {
    it("should retrieve a opportunity by ID", async () => {
      const retrieved = await thisService.get(opportunityCreated._id);
      assert.strictEqual(retrieved._id, opportunityCreated._id);
    });
  });

  describe("#update", () => {
    let opportunityUpdated;
    const options = {"states":"updated value","percentage":100,"status":"updated value"};

    beforeEach(async () => {
      opportunityUpdated = await thisService.update(opportunityCreated._id, options);
    });

    it("should update an existing opportunity ", async () => {
      assert.strictEqual(opportunityUpdated.states, options.states);
assert.strictEqual(opportunityUpdated.percentage, options.percentage);
assert.strictEqual(opportunityUpdated.status, options.status);
    });
  });

  describe("#delete", () => {
  let opportunityDeleted;
    beforeEach(async () => {
      opportunityDeleted = await thisService.remove(opportunityCreated._id);
    });

    it("should delete a opportunity", async () => {
      assert.strictEqual(opportunityDeleted._id, opportunityCreated._id);
    });
  });
});