const errorController = require("../controllers/errors");

module.exports = function (app) {
  app.all("*", errorController.pageNotFound);
  app.use(errorController.allErrors);
};
