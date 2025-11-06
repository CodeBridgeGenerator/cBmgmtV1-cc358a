module.exports = function (app) {
  const modelName = "fcm";
  const mongooseClient = app.get("mongooseClient");
  const { Schema } = mongooseClient;
  const schema = new Schema(
    {
      fcmId: {
        type: String,
        required: "FCM ID is required",
      },
      device: {
        type: String,
        description:
          "Identify the device that is sent to iOS, andorid, MacOs, Web, etc",
        required: "Device is required",
      },
      valid: { type: Boolean, default: false },

      createdBy: {
        type: Schema.Types.ObjectId,
        ref: "users",
        required: true,
      },
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
