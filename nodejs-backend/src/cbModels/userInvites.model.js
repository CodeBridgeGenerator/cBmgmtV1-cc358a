module.exports = function (app) {
  const modelName = "user_invites";
  const mongooseClient = app.get("mongooseClient");
  const { Schema } = mongooseClient;
  const schema = new Schema(
    {
      emailToInvite: {
        type: String,
        required: true,
        comment:
          "Invitation Email, p, false, true, true, true, true, true, true, , , , ,",
      },
      status: {
        type: Boolean,
        required: false,
        default: false,
        comment:
          "Status, p, false, false, false, null, null, true, true, , , , ,",
      },
      positions: [
        {
          type: Schema.Types.ObjectId,
          ref: "positions",
          comment:
            "Positions, dropdown, false, true, true, true, true, true, true, positions, positions, one-to-one, name,",
        },
      ],
      roles: [
        {
          type: Schema.Types.ObjectId,
          ref: "roles",
          comment:
            "Roles, dropdown, false, true, true, true, true, true, true, roles, roles, one-to-one, name,",
        },
      ],
      company: {
        type: Schema.Types.ObjectId,
        ref: "companies",
        comment:
          "Company, dropdown, false, true, true, true, true, true, true, companies, companies, one-to-one, name,",
      },
      branch: {
        type: Schema.Types.ObjectId,
        ref: "branches",
        comment:
          "Branch, dropdown, false, true, true, true, true, true, true, branches, branches, one-to-one, name,",
      },
      code: {
        type: Number,
        max: 1000000,
        comment:
          "Code, p, false, false, false, false, false, true, true, , , , ,",
      },
      sendMailCounter: {
        type: Number,
        max: 1000000,
        default: 0,
        comment:
          "SendMailCounter, p, false, false, false, false, false, true, true, , , , ,",
      },

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
