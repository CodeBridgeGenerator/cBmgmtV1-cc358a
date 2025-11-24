const assert = require("assert");
const app = require("../../src/app");

describe("crm service", () => {
  let thisService;
  let crmCreated;

  beforeEach(async () => {
    thisService = await app.service("crm");
  });

  it("registered the service", () => {
    assert.ok(thisService, "Registered the service (crm)");
  });

  describe("#create", () => {
    const options = {"name":"new value","company":"aasdfasdfasdfadsfadfa","person":"aasdfasdfasdfadsfadfa","opportunity":"aasdfasdfasdfadsfadfa","appCost":23,"supportCost":23,"otherCost":23};

    beforeEach(async () => {
      crmCreated = await thisService.create(options);
    });

    it("should create a new crm", () => {
      assert.strictEqual(crmCreated.name, options.name);
assert.strictEqual(crmCreated.company, options.company);
assert.strictEqual(crmCreated.person, options.person);
assert.strictEqual(crmCreated.opportunity, options.opportunity);
assert.strictEqual(crmCreated.appCost, options.appCost);
assert.strictEqual(crmCreated.supportCost, options.supportCost);
assert.strictEqual(crmCreated.otherCost, options.otherCost);
    });
  });

  describe("#get", () => {
    it("should retrieve a crm by ID", async () => {
      const retrieved = await thisService.get(crmCreated._id);
      assert.strictEqual(retrieved._id, crmCreated._id);
    });
  });

  describe("#update", () => {
    let crmUpdated;
    const options = {"name":"updated value","company":"345345345345345345345","person":"345345345345345345345","opportunity":"345345345345345345345","appCost":100,"supportCost":100,"otherCost":100};

    beforeEach(async () => {
      crmUpdated = await thisService.update(crmCreated._id, options);
    });

    it("should update an existing crm ", async () => {
      assert.strictEqual(crmUpdated.name, options.name);
assert.strictEqual(crmUpdated.company, options.company);
assert.strictEqual(crmUpdated.person, options.person);
assert.strictEqual(crmUpdated.opportunity, options.opportunity);
assert.strictEqual(crmUpdated.appCost, options.appCost);
assert.strictEqual(crmUpdated.supportCost, options.supportCost);
assert.strictEqual(crmUpdated.otherCost, options.otherCost);
    });
  });

  describe("#delete", () => {
  let crmDeleted;
    beforeEach(async () => {
      crmDeleted = await thisService.remove(crmCreated._id);
    });

    it("should delete a crm", async () => {
      assert.strictEqual(crmDeleted._id, crmCreated._id);
    });
  });
});