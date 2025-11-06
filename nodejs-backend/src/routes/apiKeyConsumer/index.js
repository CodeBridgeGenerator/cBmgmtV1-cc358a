const express = require("@feathersjs/express");
const { getAccessToken, getData } = require("./apiKeyConsumer");

function attachApp(app) {
  return (req, res, next) => {
    req.appInstance = app;
    next();
  };
}

module.exports = function (app) {
  app.use(attachApp(app));

  app.get(
    "/consumer/apiKey",
    express.json({ type: "application/json" }),
    getAccessToken,
  );

  app.post(
    "/consumer/query",
    express.json({ type: "application/json" }),
    getData,
  );
};
