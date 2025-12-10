module.exports = function (app) {
  const modelName = "permission_services";
  const mongooseClient = app.get("mongooseClient");
  const { Schema } = mongooseClient;

  const schema = new Schema(
    {
      service: {
        type: String,
        minLength: 3,
        maxLength: 1000000,
        index: true,
        trim: true,
        comment:
          "Service, p, false, true, true, true, true, true, true, , , , ,",
      },
      create: { type: Boolean, default: false },
      read: { type: Boolean, default: false },
      update: { type: Boolean, default: false },
      delete: { type: Boolean, default: false },
      import: { type: Boolean, default: false },
      export: { type: Boolean, default: false },
      seeder: { type: Boolean, default: false },
      profile: {
        type: Schema.Types.ObjectId,
        ref: "profiles",
      },
      roleId: {
        type: Schema.Types.ObjectId,
        ref: "roles",
      },
      positionId: {
        type: Schema.Types.ObjectId,
        ref: "positions",
      },
      userId: {
        type: Schema.Types.ObjectId,
        ref: "users",
      },
      roles: [{ type: Schema.Types.ObjectId, ref: "roles" }],
      positions: [{ type: Schema.Types.ObjectId, ref: "positions" }],
      profiles: [{ type: Schema.Types.ObjectId, ref: "profiles" }],

      createdBy: { type: Schema.Types.ObjectId, ref: "users", required: true },
      updatedBy: { type: Schema.Types.ObjectId, ref: "users", required: true },
    },
    {
      timestamps: true,
    },
  );

  schema.index(
    { service: 1, roleId: 1 },
    { unique: true, partialFilterExpression: { roleId: { $ne: null } } },
  );

  schema.index(
    { service: 1, positionId: 1 },
    { unique: true, partialFilterExpression: { positionId: { $ne: null } } },
  );

  schema.index(
    { service: 1, profile: 1 },
    { unique: true, partialFilterExpression: { profile: { $ne: null } } },
  );

  if (mongooseClient.modelNames().includes(modelName)) {
    mongooseClient.deleteModel(modelName);
  }
  return mongooseClient.model(modelName, schema);
};
