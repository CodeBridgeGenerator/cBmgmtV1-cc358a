module.exports = function (app) {
  const modelName = 'fcm_ques';
  const mongooseClient = app.get('mongooseClient');
  const { Schema } = mongooseClient;

  // Define the schema for the FCM Android-specific payload
  // const androidSchema = new Schema({
  //   priority: { type: String, enum: ['normal', 'high'], default: 'normal' },
  //   ttl: { type: Number, description: 'Time-to-live in seconds' },
  //   restrictedPackageName: { type: String, nullable: true },
  //   notification: {
  //     type: Schema.Types.Mixed,
  //     properties: {
  //       title: { type: String, nullable: true },
  //       body: { type: String, nullable: true },
  //       icon: { type: String, nullable: true },
  //       color: { type: String, nullable: true },
  //       sound: { type: String, nullable: true },
  //       tag: { type: String, nullable: true },
  //       clickAction: { type: String, nullable: true },
  //       bodyLocKey: { type: String, nullable: true },
  //       bodyLocArgs: [
  //         {
  //           items: { type: String },
  //           nullable: true,
  //         },
  //       ],
  //       titleLocKey: { type: String, nullable: true },
  //       titleLocArgs: [
  //         {
  //           items: { type: String },
  //           nullable: true,
  //         },
  //       ],
  //     },
  //   },
  // });

  // Define the schema for the FCM APNs-specific payload
  // const apnsSchema = new Schema({
  //   headers: {
  //     type: Schema.Types.Mixed,
  //     properties: {
  //       'apns-priority': { type: String, nullable: true },
  //       'apns-expiration': { type: String, nullable: true },
  //       'apns-topic': { type: String, nullable: true },
  //     },
  //   },
  //   payload: {
  //     type: Schema.Types.Mixed,
  //     properties: {
  //       aps: {
  //         type: Schema.Types.Mixed,
  //         properties: {
  //           alert: {
  //             type: Schema.Types.Mixed,
  //             properties: {
  //               title: { type: String, nullable: true },
  //               subtitle: { type: String, nullable: true },
  //               body: { type: String, nullable: true },
  //             },
  //           },
  //           badge: { type: Number, nullable: true },
  //           sound: { type: String, nullable: true },
  //           category: { type: String, nullable: true },
  //           threadId: { type: String, nullable: true },
  //         },
  //       },
  //     },
  //   },
  // });

  // Define the schema for the FCM Data payload
  // const dataSchema = new Schema({
  //   type: Schema.Types.Mixed,
  //   additionalProperties: { type: String }, // Arbitrary key-value pairs
  // });

  const schema = new Schema(
    {
      payload: {
        notification: {
          title: { type: String, description: 'Notification title' },
          body: { type: String, description: 'Notification body' },
          image: {
            type: String,
            description: 'Notification image URL',
            nullable: true,
          },
        },
        tokens: { type: [String] },
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
