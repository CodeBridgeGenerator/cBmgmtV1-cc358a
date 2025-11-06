module.exports = function (app) {
  const modelName = "dyna_loader";
  const mongooseClient = app.get("mongooseClient");
  const { Schema } = mongooseClient;
  const schema = new Schema(
    {
      from: {
        type: String,
        maxLength: 500,
        required: true,
        comment:
          "From Service, p, false, true, true, true, true, true, true, , , , ,",
      },
      to2: {
        type: String,
        maxLength: 500,
        required: true,
        comment: "To, p, false, true, true, true, true, true, true, , , , ,",
      },
      fileUploadedId: {
        type: Schema.Types.ObjectId,
        ref: "users",
        required: true,
      },
      isFile: { type: Boolean, default: false },
      isKey: {
        type: String,
      },
      upsert: {
        type: String,
      },
      toUpdate: {
        type: [String],
      },
      name: {
        type: String,
        required: true,
        comment: "Name, p, false, true, true, true, true, true, true, , , , ,",
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
