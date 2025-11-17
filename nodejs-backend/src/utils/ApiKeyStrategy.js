const { AuthenticationBaseStrategy } = require("@feathersjs/authentication");

class ApiKeyStrategy extends AuthenticationBaseStrategy {
  async authenticate(authentication, params) {
    // Check header or body for key
    const apiKey =
      authentication?.apiKey ||
      params.headers?.["x-api-key"] ||
      (params.headers?.authorization || "").replace(/^ApiKey\s+/i, "");

    console.log(params);
    if (!apiKey) {
      throw new Error("No API key provided");
    }

    // Look up key in DB
    const apiKeyService = this.app.service("apikey");
    const { data } = await apiKeyService.find({
      query: { apikey: apiKey, active: true, $limit: 1 },
    });

    if (!data.length) {
      console.log("invalid api key");
      throw new Error("Invalid API key");
    }

    const record = data[0];

    // Return authentication result (Feathers expects this)
    return {
      authentication: { strategy: "api-key" },
      user: record.createdBy,
    };
  }
}

module.exports = { ApiKeyStrategy };
