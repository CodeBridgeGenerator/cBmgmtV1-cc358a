module.exports = function (app) {
  const modelName = "frontends";
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
          "Project Name, p, false, true, true, true, true, true, true, , , , ,",
      },
      domain: {
        type: String,
        minLength: 2,
        maxLength: 999,
        index: true,
        trim: true,
        comment:
          "Domain, p, false, true, true, true, true, true, true, , , , ,",
      },
      env: {
        type: String,
        minLength: 2,
        maxLength: 999,
        index: true,
        trim: true,
        comment: "env, p, false, true, true, true, true, true, true, , , , ,",
      },
      firebase: {
        type: Schema.Types.ObjectId,
        ref: "firebase",
        comment:
          "Firebase, dropdown, false, true, true, true, true, true, true, firebase, firebase, one-to-one, projectId,",
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
