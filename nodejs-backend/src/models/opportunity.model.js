
    module.exports = function (app) {
        const modelName = "opportunity";
        const mongooseClient = app.get("mongooseClient");
        const { Schema } = mongooseClient;
        const schema = new Schema(
          {
            states: { type:  String , minLength: 2, maxLength: 999, index: true, trim: true, comment: "States, p, false, true, true, true, true, true, true, , , , ," },
percentage: { type: Number, max: 99999999, comment: "Percentage, p_number, false, true, true, true, true, true, true, , , , ," },
status: { type:  String , minLength: 2, maxLength: 999, index: true, trim: true, comment: "Status, p, false, true, true, true, true, true, true, , , , ," },

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