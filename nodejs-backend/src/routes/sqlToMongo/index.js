const express = require("@feathersjs/express");
const { uploadMiddleware, migrateBakToMongo, getDatabaseInfo, getTableRecords  } = require("./sqlToMongoHandler");

function attachApp(app) {
  return (req, res, next) => {
    req.appInstance = app;
    next();
  };
}

module.exports = function (app) {
  app.use(attachApp(app));

  app.post(
    "/migrate-bak",
    uploadMiddleware,
    migrateBakToMongo
  );
   app.get("/database/schema", getDatabaseInfo);
  app.get("/database/table/records", getTableRecords);
  console.log("SQL to MongoDB migration routes configured successfully");
};