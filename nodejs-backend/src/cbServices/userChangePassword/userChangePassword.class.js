const { Service } = require("feathers-mongoose");

exports.UserChangePassword = class UserChangePassword extends Service {
  async create(data, params) {
    const recentAttempt = await this.Model.findOne({
      userEmail: data.userEmail,
      createdAt: { $gt: new Date(Date.now() - 60000) },
    }).sort({ createdAt: -1 });

    if (recentAttempt) {
      throw new Error("Please wait before requesting another password reset");
    }
    data.code = require("crypto").randomBytes(32).toString("hex");
    data.status = false;

    return super.create(data, params);
  }
};
