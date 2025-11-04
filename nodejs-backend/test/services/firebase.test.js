const assert = require("assert");
const app = require("../../src/app");

describe("firebase service", () => {
  let thisService;
  let firebaseCreated;

  beforeEach(async () => {
    thisService = await app.service("firebase");
  });

  it("registered the service", () => {
    assert.ok(thisService, "Registered the service (firebase)");
  });

  describe("#create", () => {
    const options = {"projectId":"new value","url":"new value","customUrl":"new value","key":"new value","env":"new value","projectNumber":23,"webApiKey":"new value","appId":"new value"};

    beforeEach(async () => {
      firebaseCreated = await thisService.create(options);
    });

    it("should create a new firebase", () => {
      assert.strictEqual(firebaseCreated.projectId, options.projectId);
assert.strictEqual(firebaseCreated.url, options.url);
assert.strictEqual(firebaseCreated.customUrl, options.customUrl);
assert.strictEqual(firebaseCreated.key, options.key);
assert.strictEqual(firebaseCreated.env, options.env);
assert.strictEqual(firebaseCreated.projectNumber, options.projectNumber);
assert.strictEqual(firebaseCreated.webApiKey, options.webApiKey);
assert.strictEqual(firebaseCreated.appId, options.appId);
    });
  });

  describe("#get", () => {
    it("should retrieve a firebase by ID", async () => {
      const retrieved = await thisService.get(firebaseCreated._id);
      assert.strictEqual(retrieved._id, firebaseCreated._id);
    });
  });

  describe("#update", () => {
    let firebaseUpdated;
    const options = {"projectId":"updated value","url":"updated value","customUrl":"updated value","key":"updated value","env":"updated value","projectNumber":100,"webApiKey":"updated value","appId":"updated value"};

    beforeEach(async () => {
      firebaseUpdated = await thisService.update(firebaseCreated._id, options);
    });

    it("should update an existing firebase ", async () => {
      assert.strictEqual(firebaseUpdated.projectId, options.projectId);
assert.strictEqual(firebaseUpdated.url, options.url);
assert.strictEqual(firebaseUpdated.customUrl, options.customUrl);
assert.strictEqual(firebaseUpdated.key, options.key);
assert.strictEqual(firebaseUpdated.env, options.env);
assert.strictEqual(firebaseUpdated.projectNumber, options.projectNumber);
assert.strictEqual(firebaseUpdated.webApiKey, options.webApiKey);
assert.strictEqual(firebaseUpdated.appId, options.appId);
    });
  });

  describe("#delete", () => {
  let firebaseDeleted;
    beforeEach(async () => {
      firebaseDeleted = await thisService.remove(firebaseCreated._id);
    });

    it("should delete a firebase", async () => {
      assert.strictEqual(firebaseDeleted._id, firebaseCreated._id);
    });
  });
});