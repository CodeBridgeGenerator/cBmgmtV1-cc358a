module.exports = function (app) {
  const modelName = "department_h_o_d";
  const mongooseClient = app.get("mongooseClient");
  const { Schema } = mongooseClient;
  const schema = new Schema(
    {
      Department: {
        type: Schema.Types.ObjectId,
        ref: "departments",
        comment:
          "Department, dropdown, false, true, true, true, true, true, true, departments, departments, one-to-one, name,",
      },
      Head: {
        type: Schema.Types.ObjectId,
        ref: "employees",
        comment:
          "Head, dropdown, false, true, true, true, true, true, true, employees, employees, one-to-one, fullname,",
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
