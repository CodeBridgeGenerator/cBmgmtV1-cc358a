
const crm = require("./crm/crm.service.js");
const opportunity = require("./opportunity/opportunity.service.js");
const contract = require("./contract/contract.service.js");
const apikey = require("./apikey/apikey.service.js");
const backends = require("./backends/backends.service.js");
const frontends = require("./frontends/frontends.service.js");
const firebase = require("./firebase/firebase.service.js");
// ~cb-add-require-service-name~

// eslint-disable-next-line no-unused-vars
module.exports = function (app) {
    
  app.configure(crm);
  app.configure(opportunity);
  app.configure(contract);
  app.configure(apikey);
  app.configure(backends);
  app.configure(frontends);
  app.configure(firebase);
    // ~cb-add-configure-service-name~
};
