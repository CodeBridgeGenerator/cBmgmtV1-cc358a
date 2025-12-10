module.exports = function (app) {
  const modelName = "apikey";
  const mongooseClient = app.get("mongooseClient");
  const { Schema } = mongooseClient;
  const schema = new Schema(
    {
      apikey: {
        type: String,
        minLength: 2,
        maxLength: 999,
        index: true,
        trim: true,
        comment:
          "APIKEY, p, false, true, true, true, true, true, true, , , , ,",
      },
      projectName: {
        type: String,
        minLength: 2,
        maxLength: 999,
        index: true,
        trim: true,
        comment:
          "projectName, p, false, true, true, true, true, true, true, , , , ,",
      },
      requests: {
        type: Number,
        max: 99999999,
        comment:
          "requests, p_number, false, true, true, true, true, true, true, , , , ,",
      },
      duration: {
        type: Number,
        max: 99999999,
        comment:
          "duration, p_number, false, true, true, true, true, true, true, , , , ,",
      },
      serviceName: {
        type: String,
        minLength: 2,
        maxLength: 999,
        index: true,
        trim: true,
        comment:
          "serviceName, p, false, true, true, true, true, true, true, , , , ,",
      },
      active: {
        type: Boolean,
        required: false,
        comment:
          "active, p_boolean, false, true, true, true, true, true, true, , , , ,",
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
