module.exports = function (app) {
  const modelName = "backends";
  const mongooseClient = app.get("mongooseClient");
  const { Schema } = mongooseClient;
  const schema = new Schema(
    {
      projectName: {
        type: String,
        minLength: 2,
        maxLength: 999,
        index: true,
        trim: true,
        comment:
          "projectName, p, false, true, true, true, true, true, true, , , , ,",
      },
      port: {
        type: Number,
        max: 99999999,
        comment:
          "port, p_number, false, true, true, true, true, true, true, , , , ,",
      },
      domain: {
        type: String,
        minLength: 2,
        maxLength: 999,
        index: true,
        trim: true,
        comment:
          "domain, p, false, true, true, true, true, true, true, , , , ,",
      },
      env: {
        type: String,
        minLength: 2,
        maxLength: 999,
        index: true,
        trim: true,
        comment: "env, p, false, true, true, true, true, true, true, , , , ,",
      },
      frontend: {
        type: Schema.Types.ObjectId,
        ref: "frontends",
        comment:
          "frontend, dropdown, false, true, true, true, true, true, true, frontends, frontends, one-to-one, projectName,",
      },
      contract: {
        type: Schema.Types.ObjectId,
        ref: "contract",
        comment:
          "Contract, dropdown, false, true, true, true, true, true, true, contract, contract, one-to-one, crm,",
      },
      dir: {
        type: String,
        minLength: 2,
        maxLength: 999,
        index: true,
        trim: true,
        comment: "Dir, p, false, true, true, true, true, true, true, , , , ,",
      },

      createdBy: { type: Schema.Types.ObjectId, ref: "users", required: true },
      updatedBy: { type: Schema.Types.ObjectId, ref: "users", required: true },
    },
    {
      timestamps: true,
    },
  );

  if (mongooseClient.modelNames().includes(modelName)) {
    mongooseClient.deleteModel(modelName);
  }
  return mongooseClient.model(modelName, schema);
};
