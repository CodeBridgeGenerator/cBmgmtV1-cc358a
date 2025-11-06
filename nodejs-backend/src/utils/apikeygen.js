const crypto = require("crypto");

module.exports = function generateApiKey(options = {}) {
  const { length = 32, prefix = "api_", suffix = "tenant_id" } = options;

  return async (context) => {
    if (context.method === "create" && context.data) {
      const key = crypto.randomBytes(length / 2).toString("hex");
      context.data.apikey = `${prefix}${key}${suffix}`;
      if (context.data.active === undefined) {
        context.data.active = true;
      }
    }

    return context;
  };
};
