module.exports = function (app) {
  const modelName = "user_addresses";
  const mongooseClient = app.get("mongooseClient");
  const { Schema } = mongooseClient;
  const schema = new Schema(
    {
      userId: {
        type: Schema.Types.ObjectId,
        ref: "users",
        comment:
          "User, dropdown, true, true, true, true, true, true, true, users, users, one-to-one, name,",
      },
      Street1: {
        type: String,
        minLength: 3,
        maxLength: 10000,
        index: true,
        trim: true,
        comment:
          "Street1, inputTextarea, false, true, true, true, true, true, true, , , , ,",
      },
      Street2: {
        type: String,
        minLength: 3,
        maxLength: 10000,
        index: true,
        trim: true,
        comment:
          "Street2, inputTextarea, false, true, true, true, true, true, true, , , , ,",
      },
      Poscode: {
        type: String,
        maxLength: 1000,
        index: true,
        trim: true,
        comment:
          "Poscode, p, false, true, true, true, true, true, true, , , , ,",
      },
      City: {
        type: String,
        minLength: 3,
        maxLength: 1000,
        index: true,
        trim: true,
        comment: "City, p, false, true, true, true, true, true, true, , , , ,",
      },
      State: {
        type: String,
        minLength: 3,
        maxLength: 1000,
        index: true,
        trim: true,
        comment: "State, p, false, true, true, true, true, true, true, , , , ,",
      },
      Province: {
        type: String,
        minLength: 3,
        maxLength: 1000,
        index: true,
        trim: true,
        comment:
          "Province, p, false, true, true, true, true, true, true, , , , ,",
      },
      Country: {
        type: String,
        minLength: 3,
        maxLength: 1000,
        index: true,
        trim: true,
        comment:
          "Country, p, false, true, true, true, true, true, true, , , , ,",
      },
      isDefault: {
        type: Boolean,
        required: false,
        comment:
          "Is Default, tick, false, true, true, true, true, true, true, , , , ,",
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
