module.exports = function (app) {
  const modelName = "crm";
  const mongooseClient = app.get("mongooseClient");
  const { Schema } = mongooseClient;
  const schema = new Schema(
    {
      name: {
        type: String,
        comment: "Name, p, false, true, true, true, true, true, true, , , , ,",
      },
      company: {
        type: Schema.Types.ObjectId,
        ref: "companies",
        comment:
          "Company, dropdown, false, true, true, true, true, true, true, companies, companies, one-to-one, name,",
      },
      person: {
        type: Schema.Types.ObjectId,
        ref: "branches",
        comment:
          "Person, dropdown, false, true, true, true, true, true, true, branches, branches, one-to-one, name,",
      },
      opportunity: {
        type: Schema.Types.ObjectId,
        ref: "opportunity",
        comment:
          "Opportunity, dropdown, false, true, true, true, true, true, true, opportunity, opportunity, one-to-one, states,",
      },
      appCost: {
        type: Number,
        max: 99999999,
        comment:
          "App Cost, p_number, false, true, true, true, true, true, true, , , , ,",
      },
      supportCost: {
        type: Number,
        max: 99999999,
        comment:
          "Support Cost, p_number, false, true, true, true, true, true, true, , , , ,",
      },
      otherCost: {
        type: Number,
        max: 99999999,
        comment:
          "Other Cost, p_number, false, true, true, true, true, true, true, , , , ,",
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
