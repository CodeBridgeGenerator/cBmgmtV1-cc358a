module.exports = function (app) {
  const modelName = "profile_menu";
  const mongooseClient = app.get("mongooseClient");
  const { Schema } = mongooseClient;

  const submenuSchema = new Schema({
    name: { type: String, required: false },
    routePage: { type: String, required: false },
    icon: { type: String },
  });

  const menuItemSchema = new Schema({
    name: { type: String, required: false },
    routePage: { type: String, required: false },
    submenus: [submenuSchema],
    icon: { type: String },
  });

  const schema = new Schema(
    {
      roles: [{ type: Schema.Types.ObjectId, ref: "roles" }],
      positions: [{ type: Schema.Types.ObjectId, ref: "positions" }],
      profiles: [{ type: Schema.Types.ObjectId, ref: "profiles" }],
      user: { type: Schema.Types.ObjectId, ref: "users" },
      company: { type: Schema.Types.ObjectId, ref: "companies" },
      branch: { type: Schema.Types.ObjectId, ref: "branches" },
      department: { type: Schema.Types.ObjectId, ref: "departments" },
      section: { type: Schema.Types.ObjectId, ref: "sections" },
      menuItems: [menuItemSchema],
      createdBy: { type: Schema.Types.ObjectId, ref: "users", required: false },
      updatedBy: { type: Schema.Types.ObjectId, ref: "users", required: false },
    },
    { timestamps: true },
  );

  if (mongooseClient.modelNames().includes(modelName)) {
    mongooseClient.deleteModel(modelName);
  }
  return mongooseClient.model(modelName, schema);
};
