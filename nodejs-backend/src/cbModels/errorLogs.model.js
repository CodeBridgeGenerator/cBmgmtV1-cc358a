module.exports = function (app) {
  const modelName = "error_logs";
  const mongooseClient = app.get("mongooseClient");
  const { Schema } = mongooseClient;
  const schema = new Schema(
    {
      serviceName: {
        type: String,
        comment:
          "ServiceName, p, false, true, true, true, true, true, true, , , , ,",
      },
      errorMessage: {
        type: Schema.Types.Mixed,
        comment:
          "ErrorMessage, json, false, true, true, true, true, true, true, , , , ,",
      },
      message: {
        type: Schema.Types.Mixed,
        comment:
          "Message, json, false, true, true, true, true, true, true, , , , ,",
      },
      requestBody: {
        type: Schema.Types.Mixed,
        comment:
          "Request Body, json, false, false, false, false, false, false, false, , , , ,",
      },
      stack: {
        type: String,
        comment:
          "Stack, p, false, false, false, false, false, false, false, , , , ,",
      },
      details: {
        type: String,
        comment:
          "Details, p, false, false, false, false, false, false, false, , , , ,",
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
