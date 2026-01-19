const express = require("@feathersjs/express");
const { uploadMiddleware, migrateBakToMongo } = require("./sqlToMongoHandler");

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
  
  console.log("SQL to MongoDB migration routes configured successfully");
};