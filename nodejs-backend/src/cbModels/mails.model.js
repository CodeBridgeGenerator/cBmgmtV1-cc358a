module.exports = function (app) {
  const modelName = "mails";
  const mongooseClient = app.get("mongooseClient");
  const { Schema } = mongooseClient;
  const schema = new Schema(
    {
      sentDateTime: {
        type: Date,
        comment:
          "Sent Date Time, p_date, false, true, true, true, true, true, true, , , , ,",
      },
      sentStatus: {
        type: Boolean,
        required: false,
        comment:
          "Sent Status, p_boolean, false, true, true, true, true, true, true, , , , ,",
      },
      mailType: {
        type: String,
        minLength: 2,
        maxLength: 150,
        index: true,
        trim: true,
        comment:
          "Mail Type, p, false, true, true, true, true, true, true, , , , ,",
      },
      toHistory: {
        type: Schema.Types.Mixed,
        comment:
          "To History, p, false, true, true, true, true, true, true, , , , ,",
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
