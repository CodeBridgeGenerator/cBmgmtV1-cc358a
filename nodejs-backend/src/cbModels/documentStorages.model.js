module.exports = function (app) {
  const modelName = "document_storages";
  const mongooseClient = app.get("mongooseClient");
  const { Schema } = mongooseClient;
  const schema = new Schema(
    {
      name: {
        type: String,
        required: true,
        unique: false,
        lowercase: false,
        uppercase: false,
        minLength: null,
        maxLength: 10000,
        index: false,
        trim: false,
      },
      size: { type: Number, max: 1000000000000000 },
      path: {
        type: String,
        required: true,
        unique: false,
        lowercase: false,
        uppercase: false,
        maxLength: 1000,
        index: false,
        trim: false,
      },
      lastModifiedDate: { type: Date },
      lastModified: { type: Number, max: 1000000000000000 },
      eTag: {
        type: String,
        required: true,
        unique: false,
        lowercase: false,
        uppercase: false,
        index: false,
        trim: false,
      },
      versionId: {
        type: String,
        required: true,
        unique: false,
        lowercase: false,
        uppercase: false,
        index: false,
        trim: false,
      },
      url: {
        type: String,
        required: true,
        unique: false,
        lowercase: false,
        uppercase: false,
        index: false,
        trim: false,
      },
      tableId: {
        type: String,

        unique: false,
        lowercase: false,
        uppercase: false,
        index: false,
        trim: false,
      },
      tableName: {
        type: String,
        required: true,
        unique: false,
        lowercase: false,
        uppercase: false,
        index: false,
        trim: false,
      },

      createdBy: {
        type: Schema.Types.ObjectId,
        ref: "users",
        // required: true,
      },
      updatedBy: {
        type: Schema.Types.ObjectId,
        ref: "users",
        // required: true,
      },
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
