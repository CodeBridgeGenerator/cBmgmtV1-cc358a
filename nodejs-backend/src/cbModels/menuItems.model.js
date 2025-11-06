module.exports = function (app) {
  const modelName = "menu_items";
  const mongooseClient = app.get("mongooseClient");
  const { Schema } = mongooseClient;

  const submenuSchema = new Schema({
    name: { type: String, required: true },
    routePage: { type: String, required: true },
    icon: { type: String },
  });

  const menuItemSchema = new Schema({
    name: { type: String, required: true },
    routePage: { type: String, required: true },
    submenus: [submenuSchema],
    icon: { type: String },
  });

  const schema = new Schema(
    {
      menuItems: [menuItemSchema],
      userContext: {
        type: Schema.Types.ObjectId,
        ref: "profileMenu",
        required: false,
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
