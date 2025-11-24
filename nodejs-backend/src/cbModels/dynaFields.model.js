module.exports = function (app) {
  const modelName = "dyna_fields";
  const mongooseClient = app.get("mongooseClient");
  const { Schema } = mongooseClient;
  const schema = new Schema(
    {
      dynaLoader: {
        type: Schema.Types.ObjectId,
        ref: "dyna_loader",
        comment:
          "DynaLoader, dropdown, false, true, true, true, true, true, true, dynaLoader, dyna_loader, one-to-one, name,",
      },
      from: {
        type: String,
        comment:
          "From Field, p, false, true, true, true, true, true, true, , , , ,",
      },
      fromType: {
        type: Schema.Types.Mixed,
        required: true,
        comment:
          "From Field Type, p, false, true, true, true, true, true, true, , , , ,",
      },
      to2: {
        type: String,
        comment:
          "To Field, p, false, true, true, true, true, true, true, , , , ,",
      },
      toType: {
        type: String,
        comment:
          "To Field Type, p, false, true, true, true, true, true, true, , , , ,",
      },
      fromRefService: {
        type: String,
        comment:
          "From Ref Service, p, false, true, true, true, true, true, true, , , , ,",
      },
      toRefService: {
        type: String,
        comment:
          "To Ref Service, p, false, true, true, true, true, true, true, , , , ,",
      },
      fromIdentityFieldName: {
        type: String,
        comment:
          "From Field Identity, p, false, true, true, true, true, true, true, , , , ,",
      },
      toIdentityFieldName: {
        type: String,
        comment:
          "To Field Identity, p, false, true, true, true, true, true, true, , , , ,",
      },
      fromRelationship: {
        type: String,
        comment:
          "From Field Relationship, p, false, true, true, true, true, true, true, , , , ,",
      },
      toRelationship: {
        type: String,
        comment:
          "To Field Relationship, p, false, true, true, true, true, true, true, , , , ,",
      },
      duplicates: {
        type: Boolean,
        required: true,
        default: false,
        comment:
          "Duplicates, p, false, true, false, true, true, true, false, , , , ,",
      },
      defaultValue: {
        type: Schema.Types.Mixed,
      },
      identifierFieldName: {
        type: [String],
        comment:
          "Identifier Field Name, p, false, true, true, true, true, true, true, , , , ,",
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
