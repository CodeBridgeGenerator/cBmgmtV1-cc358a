module.exports = function (app) {
  const modelName = "firebase";
  const mongooseClient = app.get("mongooseClient");
  const { Schema } = mongooseClient;
  const schema = new Schema(
    {
      projectId: {
        type: String,
        minLength: 2,
        maxLength: 999,
        index: true,
        trim: true,
        comment:
          "Project ID, p, false, true, true, true, true, true, true, , , , ,",
      },
      url: {
        type: String,
        minLength: 2,
        maxLength: 999,
        index: true,
        trim: true,
        comment: "URL, p, false, true, true, true, true, true, true, , , , ,",
      },
      customUrl: {
        type: String,
        minLength: 2,
        maxLength: 999,
        index: true,
        trim: true,
        comment:
          "Custom Url, p, false, true, true, true, true, true, true, , , , ,",
      },
      key: {
        type: String,
        minLength: 2,
        maxLength: 999,
        index: true,
        trim: true,
        comment: "Key, p, false, true, true, true, true, true, true, , , , ,",
      },
      env: {
        type: String,
        minLength: 2,
        maxLength: 999,
        index: true,
        trim: true,
        comment: "env, p, false, true, true, true, true, true, true, , , , ,",
      },
      projectNumber: {
        type: Number,
        max: 1031774158997,
        comment:
          "Project number, p_number, false, true, true, true, true, true, true, , , , ,",
      },
      webApiKey: {
        type: String,
        minLength: 2,
        maxLength: 999,
        index: true,
        trim: true,
        comment:
          "Web API Key, p, false, true, true, true, true, true, true, , , , ,",
      },
      appId: {
        type: String,
        minLength: 2,
        maxLength: 999,
        index: true,
        trim: true,
        comment:
          "App ID, p, false, true, true, true, true, true, true, , , , ,",
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
