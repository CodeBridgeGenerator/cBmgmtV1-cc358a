module.exports = function (app) {
  const modelName = "user_tracker";
  const mongooseClient = app.get("mongooseClient");
  const { Schema } = mongooseClient;
  const schema = new Schema(
    {
      pageName: {
        type: String,
        require: true,
      },
      trackerCode: {
        type: String,
        require: true,
      },
      userAgent: {
        type: String,
      },
      language: {
        type: String,
      },
      timezone: {
        type: String,
      },
      cookiesEnabled: {
        type: String,
      },
      doNotTrack: {
        type: String,
      },
      hardwareConcurrency: {
        type: String,
      },
      marketCode: {
        type: String,
      },
      isLoggedIn: {
        type: Boolean,
      },
      userId: { type: Schema.Types.ObjectId, ref: "users", required: false },
      createdBy: { type: Schema.Types.ObjectId, ref: "users", required: false },
      updatedBy: { type: Schema.Types.ObjectId, ref: "users", required: false },
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
