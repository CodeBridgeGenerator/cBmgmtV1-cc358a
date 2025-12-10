module.exports = function (app) {
  const modelName = "staffinfo";
  const mongooseClient = app.get("mongooseClient");
  const { Schema } = mongooseClient;
  const schema = new Schema(
    {
      empno: {
        type: Number,
        max: 1000000,
        comment:
          "Empno, p_number, false, true, true, true, true, true, true, , , , ,",
      },
      name: {
        type: String,
        minLength: 2,
        maxLength: 1000,
        index: true,
        trim: true,
        comment: "Name, p, false, true, true, true, true, true, true, , , , ,",
      },
      namenric: {
        type: String,
        minLength: 2,
        maxLength: 1000,
        index: true,
        trim: true,
        comment:
          "Namenric, p, false, true, true, true, true, true, true, , , , ,",
      },
      compcode: {
        type: Number,
        max: 10000000,
        comment:
          "Compcode, p_number, false, true, true, true, true, true, true, , , , ,",
      },
      compname: {
        type: String,
        minLength: 2,
        maxLength: 1000,
        index: true,
        trim: true,
        comment:
          "Compname, p, false, true, true, true, true, true, true, , , , ,",
      },
      deptcode: {
        type: String,
        minLength: 2,
        maxLength: 1000,
        index: true,
        trim: true,
        comment:
          "Deptcode, p, false, true, true, true, true, true, true, , , , ,",
      },
      deptdesc: {
        type: String,
        minLength: 2,
        maxLength: 1000,
        index: true,
        trim: true,
        comment:
          "Deptdesc, p, false, true, true, true, true, true, true, , , , ,",
      },
      sectcode: {
        type: Number,
        max: 50035066,
        comment:
          "Sectcode, p_number, false, true, true, true, true, true, true, , , , ,",
      },
      sectdesc: {
        type: String,
        minLength: 2,
        maxLength: 1000,
        index: true,
        trim: true,
        comment:
          "Sectdesc, p, false, true, true, true, true, true, true, , , , ,",
      },
      designation: {
        type: String,
        minLength: 2,
        maxLength: 1000,
        index: true,
        trim: true,
        comment:
          "Designation, p, false, true, true, true, true, true, true, , , , ,",
      },
      email: {
        type: String,
        minLength: 2,
        maxLength: 1000,
        index: true,
        trim: true,
        comment: "Email, p, false, true, true, true, true, true, true, , , , ,",
      },
      resign: {
        type: String,
        minLength: 2,
        maxLength: 1000,
        index: true,
        trim: true,
        comment:
          "Resign, p, false, true, true, true, true, true, true, , , , ,",
      },
      supervisor: {
        type: String,
        minLength: 2,
        maxLength: 1000,
        index: true,
        trim: true,
        comment:
          "Supervisor, p, false, true, true, true, true, true, true, , , , ,",
      },
      datejoin: {
        type: Number,
        max: 10000000,
        comment:
          "Datejoin, p_number, false, true, true, true, true, true, true, , , , ,",
      },
      empgroup: {
        type: String,
        minLength: 2,
        maxLength: 1000,
        index: true,
        trim: true,
        comment:
          "Empgroup, p, false, true, true, true, true, true, true, , , , ,",
      },
      empgradecode: {
        type: String,
        minLength: 2,
        maxLength: 1000,
        index: true,
        trim: true,
        comment:
          "Empgradecode, p, false, true, true, true, true, true, true, , , , ,",
      },
      terminationdate: {
        type: String,
        minLength: 2,
        maxLength: 1000,
        index: true,
        trim: true,
        comment:
          "Terminationdate, p, false, true, true, true, true, true, true, , , , ,",
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
