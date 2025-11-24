module.exports = function (app) {
  const modelName = "inbox";
  const mongooseClient = app.get("mongooseClient");
  const { Schema } = mongooseClient;
  const schema = new Schema(
    {
      from: {
        type: Schema.Types.ObjectId,
        ref: "users",
        comment:
          "From, dropdown, false, true, true, true, true, true, true, users, users, one-to-one, name,",
      },
      toUser: {
        type: Schema.Types.ObjectId,
        ref: "users",
        comment:
          "ToUser, dropdown, false, true, true, true, true, true, true, users, users, one-to-one, name,",
      },
      subject: {
        type: String,
        required: true,
        maxLength: 1000,
        comment:
          "Subject, p, false, true, true, true, true, true, true, , , , ,",
      },
      content: {
        type: String,
        required: true,
        comment:
          "Content, p, false, true, true, true, true, true, true, , , , ,",
      },
      service: {
        type: String,
        required: true,
        maxLength: 1000,
        comment:
          "Service, p, false, true, true, true, true, true, true, , , , ,",
      },
      read: {
        type: Boolean,
        required: false,
        default: false,
        comment:
          "Read, p_boolean, false, true, true, true, true, true, true, , , , ,",
      },
      flagged: {
        type: Boolean,
        required: false,
        default: false,
        comment:
          "Flagged, tick, false, true, true, true, true, true, true, , , , ,",
      },
      sent: {
        type: Date,
        comment:
          "Sent, calendar_12, false, true, true, true, true, true, true, , , , ,",
      },

      links: [
        {
          url: { type: String, required: true },
          name: { type: String, required: true },
        },
      ],

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
