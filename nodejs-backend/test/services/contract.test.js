const assert = require("assert");
const app = require("../../src/app");

describe("contract service", () => {
  let thisService;
  let contractCreated;

  beforeEach(async () => {
    thisService = await app.service("contract");
  });

  it("registered the service", () => {
    assert.ok(thisService, "Registered the service (contract)");
  });

  describe("#create", () => {
    const options = {"crm":"aasdfasdfasdfadsfadfa","po":"new value","start":1763956700993,"uatDate":1763956700993,"migrationDate":1763956700993,"supportDate":1763956700993};

    beforeEach(async () => {
      contractCreated = await thisService.create(options);
    });

    it("should create a new contract", () => {
      assert.strictEqual(contractCreated.crm, options.crm);
assert.strictEqual(contractCreated.po, options.po);
assert.strictEqual(contractCreated.start, options.start);
assert.strictEqual(contractCreated.uatDate, options.uatDate);
assert.strictEqual(contractCreated.migrationDate, options.migrationDate);
assert.strictEqual(contractCreated.supportDate, options.supportDate);
    });
  });

  describe("#get", () => {
    it("should retrieve a contract by ID", async () => {
      const retrieved = await thisService.get(contractCreated._id);
      assert.strictEqual(retrieved._id, contractCreated._id);
    });
  });

  describe("#update", () => {
    let contractUpdated;
    const options = {"crm":"345345345345345345345","po":"updated value","start":null,"uatDate":null,"migrationDate":null,"supportDate":null};

    beforeEach(async () => {
      contractUpdated = await thisService.update(contractCreated._id, options);
    });

    it("should update an existing contract ", async () => {
      assert.strictEqual(contractUpdated.crm, options.crm);
assert.strictEqual(contractUpdated.po, options.po);
assert.strictEqual(contractUpdated.start, options.start);
assert.strictEqual(contractUpdated.uatDate, options.uatDate);
assert.strictEqual(contractUpdated.migrationDate, options.migrationDate);
assert.strictEqual(contractUpdated.supportDate, options.supportDate);
    });
  });

  describe("#delete", () => {
  let contractDeleted;
    beforeEach(async () => {
      contractDeleted = await thisService.remove(contractCreated._id);
    });

    it("should delete a contract", async () => {
      assert.strictEqual(contractDeleted._id, contractCreated._id);
    });
  });
});