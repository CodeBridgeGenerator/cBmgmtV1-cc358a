
module.exports = function (app) {
  const modelName = "help_sidebar_contents";
  const mongooseClient = app.get("mongooseClient");
  const { Schema } = mongooseClient;
  const schema = new Schema(
    {
      serviceName: { type: String, required: true, comment: "Service Name, p, false, true, true, true, true, true, true, , , , ," },
      purpose: { type: String, comment: "Purpose, p, false, true, true, true, true, true, true, , , , ," },
      path: { type: String, comment: "Path, p, false, true, true, true, true, true, true, , , , ," },
      features: { type: String, comment: "Features, p, false, true, true, true, true, true, true, , , , ," },
      guide: { type: String, comment: "Guide, p, false, true, true, true, true, true, true, , , , ," },
      content: { type: String, comment: "Content, p, false, true, true, true, true, true, true, , , , ," },
      video: { type: String, comment: "Video, p, false, true, true, true, true, true, true, , , , ," },

      createdBy: { type: Schema.Types.ObjectId, ref: "users", required: true },
      updatedBy: { type: Schema.Types.ObjectId, ref: "users", required: true }
    },
    {
      timestamps: true
    });


  if (mongooseClient.modelNames().includes(modelName)) {
    mongooseClient.deleteModel(modelName);
  }
  return mongooseClient.model(modelName, schema);

};