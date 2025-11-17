const express = require("@feathersjs/express");
const { getData, setData } = require("./apiKeyConsumer");

function attachApp(app) {
  return (req, res, next) => {
    req.appInstance = app;
    next();
  };
}

module.exports = function (app) {
  app.use(attachApp(app));

  app.post(
    "/consumer/read",
    express.json({ type: "application/json" }),
    getData,
  );
  app.post(
    "/consumer/cupd",
    express.json({ type: "application/json" }),
    setData,
  );
};
