module.exports = function (app) {
  const modelName = "job_ques";
  const mongooseClient = app.get("mongooseClient");
  const { Schema } = mongooseClient;
  const schema = new Schema(
    {
      name: {
        type: String,
        required: true,
        maxLength: 150,
        comment:
          "Name, p, false, false, false, null, null, true, true, , , , ,",
      },
      type: {
        type: String,
        required: true,
        maxLength: 150,
        comment:
          "Type, p, false, false, false, null, null, true, true, , , , ,",
      },
      fromService: {
        type: String,
        required: true,
        maxLength: 1000,
        comment:
          "From Service, p, false, false, false, null, null, true, true, , , , ,",
      },
      toService: {
        type: String,
        required: true,
        maxLength: 1000,
        comment:
          "To Service, p, false, false, false, null, null, true, true, , , , ,",
      },
      start: {
        type: Date,
        comment:
          "Start, p_date, false, false, false, null, null, true, true, , , , ,",
      },
      end: {
        type: Date,
        comment:
          "End, p_date, false, false, false, null, null, true, true, , , , ,",
      },
      jobId: {
        type: Number,
        comment:
          "Job Id, p, false, false, false, null, null, true, true, , , , ,",
      },
      status: {
        type: Boolean,
        required: false,
        default: false,
        comment:
          "Status, p, false, false, false, null, null, true, true, , , , ,",
      },
      dynaLoaderId: {
        type: Schema.Types.ObjectId,
        ref: "dyna_loader",
        comment:
          "DynaLoader Id, dropdown, false, true, true, true, true, true, true, dynaLoader, dyna_loader, one-to-one, name,",
      },
      email: {
        type: String,
        required: true,
        comment: "Email, p, false, true, true, true, true, true, true, , , , ,",
      },
      isFile: {
        type: String,
        required: true,
        comment:
          "Is File, p, false, true, true, true, true, true, true, , , , ,",
      },
      fileUploadedStorageId: {
        type: String,
        required: true,
        comment:
          "File Uploaded Storage Id, p, false, true, true, true, true, true, true, , , , ,",
      },
      isKey: {
        type: String,
        required: true,
        comment:
          "Is Key, p, false, true, true, true, true, true, true, , , , ,",
      },
      toUpdate: {
        type: [String],
        required: true,
        maxLength: 150,
        index: true,
        trim: true,
        description: "isArray",
        comment:
          "To Update, p, false, false, false, true, true, true, true, , , , ,",
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
