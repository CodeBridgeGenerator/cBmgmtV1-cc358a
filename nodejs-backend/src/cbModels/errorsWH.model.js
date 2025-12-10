module.exports = function (app) {
  const modelName = "errors_w_h";
  const mongooseClient = app.get("mongooseClient");
  const { Schema } = mongooseClient;
  const schema = new Schema(
    {
      date: {
        type: Date,
        comment:
          "Date, p_calendar, false, true, true, true, true, true, true, , , , ,",
      },
      details: {
        type: Schema.Types.Mixed,
        comment:
          "Details, p, false, true, true, true, true, true, true, , , , ,",
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
