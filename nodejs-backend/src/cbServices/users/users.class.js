const { Service } = require("feathers-mongoose");

exports.Users = class Users extends Service {
  async find(params) {
    // Convert email to lowercase if it exists in query
    if (params.query && params.query.email) {
      params.query.email = params.query.email.toLowerCase();
    }
    return super.find(params);
  }
};
