module.exports = function (app) {
  const modelName = "steps";
  const mongooseClient = app.get("mongooseClient");
  const { Schema } = mongooseClient;
  const schema = new Schema(
    {
      userGuideID: {
        type: Schema.Types.ObjectId,
        ref: "user_guide",
        comment: "UserGuideID, dropdown",
      },
      Steps: { type: String, required: true, comment: "Steps, p" },
      Description: { type: String, required: true, comment: "Description, p" },

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
