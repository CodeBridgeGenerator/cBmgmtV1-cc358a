module.exports = function (app) {
  const modelName = "contract";
  const mongooseClient = app.get("mongooseClient");
  const { Schema } = mongooseClient;
  const schema = new Schema(
    {
      crm: {
        type: Schema.Types.ObjectId,
        ref: "crm",
        comment:
          "CRM, dropdown, false, true, true, true, true, true, true, crm, crm, one-to-one, name,",
      },
      po: {
        type: String,
        minLength: 2,
        maxLength: 999,
        index: true,
        trim: true,
        comment: "PO, p, false, true, true, true, true, true, true, , , , ,",
      },
      start: {
        type: Date,
        comment:
          "Start, p_date, false, true, true, true, true, true, true, , , , ,",
      },
      uatDate: {
        type: Date,
        comment:
          "UAT Date, p_date, false, true, true, true, true, true, true, , , , ,",
      },
      migrationDate: {
        type: Date,
        comment:
          "Migration Date, p_date, false, true, true, true, true, true, true, , , , ,",
      },
      supportDate: {
        type: Date,
        comment:
          "Support Date, p_date, false, true, true, true, true, true, true, , , , ,",
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
