module.exports = function (app) {
  const modelName = "user_change_password";
  const mongooseClient = app.get("mongooseClient");
  const { Schema } = mongooseClient;
  const schema = new Schema(
    {
      userEmail: {
        type: String,
        required: true,
        comment:
          "User Email, p, false, true, true, true, true, true, true, , , , ,",
      },
      server: {
        type: String,
        required: true,
        comment:
          "Server, p, false, true, true, true, true, true, true, , , , ,",
      },
      environment: {
        type: String,
        required: true,
        comment:
          "Environment, p, false, true, true, true, true, true, true, , , , ,",
      },
      code: {
        type: String,
        required: true,
        comment: "Code, p, false, true, true, true, true, true, true, , , , ,",
      },
      status: {
        type: Boolean,
        required: false,
        default: false,
        comment:
          "Status, p_boolean, false, true, true, true, true, true, true, , , , ,",
      },
      sendEmailCounter: {
        type: Number,
        max: 1000000,
        default: 0,
        comment:
          "SendEmailCounter, p_number, false, true, true, true, true, true, true, , , , ,",
      },
      lastAttempt: { type: Date },
      ipAddress: { type: String },
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
