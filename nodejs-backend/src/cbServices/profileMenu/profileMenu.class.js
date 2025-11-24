const { Service } = require("feathers-mongoose");

exports.ProfileMenu = class ProfileMenu extends Service {
  async find(params) {
    const query = { ...params.query };
    if (query.profile || query.position || query.role) {
      const fallbackOrder = ["profile", "position", "role"];
      for (const field of fallbackOrder) {
        if (query[field]) {
          const fallbackQuery = { [field]: query[field] };
          const results = await super.find({ ...params, query: fallbackQuery });
          if (results.length > 0) {
            return results;
          }
        }
      }
    }
    return super.find({ ...params, query });
  }
};
