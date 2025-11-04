const fs = require("fs");
const fileFolder = "./src/resources";
// const fileUploded = './src/uploaded';
const codeGen = require("./utils/codegen");
const _ = require("lodash");
const mongoose = require("mongoose");
const { decryptData } = require("./utils/encryption");

// Your setup function
module.exports = (app) => {
  initializeSuperUser(app);
  insertRefData(app);
  // console.debug("Setup completed.");
};

// async function moveFile(file) {
//   const source = `${fileFolder}/${file}`;
//   const destination = `${fileUploded}/${file}`;

//   try {
//     await fsp.rename(source, destination);
//     console.debug(`File moved from ${source} to ${destination}`);
//   } catch (error) {
//     console.error(`Error moving file: ${error.message}`);
//   }
// }

const initializeSuperUser = async (app) => {
  const userEmail = ["kana@cloudbasha.com"];
  try {
    let getUserEmail = await app.service("userInvites").find({
      query: {
        emailToInvite: { $in: userEmail },
      },
    });

    // Decrypt the response if encrypted
    if (getUserEmail && getUserEmail.encrypted) {
      // console.debug("Decrypting userInvites response:", getUserEmail.encrypted);
      getUserEmail = decryptData(getUserEmail.encrypted);
      // console.debug("Decrypted userInvites response:", JSON.stringify(getUserEmail, null, 2));
    }

    if (!getUserEmail.data || getUserEmail.data.length === 0) {
      await app.service("userInvites").create(
        userEmail.map((user) => ({
          emailToInvite: user,
          status: false,
          sendMailCounter: 0,
          code: codeGen(),
        })),
      );
      // console.debug(`Created userInvites for: ${userEmail.join(", ")}`);
    } else {
      // console.debug(`userInvites already exist for: ${userEmail.join(", ")}`);
    }
  } catch (error) {
    console.error("Error initializing super user:", error.message);
  }
};

const insertRefData = (app) => {
  let files = fs.readdirSync(fileFolder);
  files = files.filter(
    (file) => !["config.json", "standard.json"].includes(file),
  );

  const sortOrder = [
    "templates",
    "roles",
    "positions",
    // "users",
    // "profiles",
    "permission_services",
    "companies",
    "branches",
  ];
  files = files.sort((a, b) => a.localeCompare(b));
  files = _.sortBy(files, function (file) {
    return _.indexOf(sortOrder, file.split(".")[1]);
  });

  const promises = [];
  const services = [];
  const results = [];

  files.forEach((file) => {
    const names = file.split(".");
    const service = _.camelCase(names[1]);
    if (service) {
      const existing = app.service(service).find({});
      promises.push(existing);
      services.push(service);
    } else console.debug("file empty", names[1]);
  });

  if (_.isEmpty(services)) return;

  Promise.all(promises).then(async (allData) => {
    try {
      services.forEach(async (service, i) => {
        try {
          let data = allData[i];
          // Decrypt data if encrypted
          if (data && data.encrypted) {
            console.debug(`Decrypting ${service} response:`, data.encrypted);
            data = decryptData(data.encrypted);
            console.debug(
              `Decrypted ${service} response:`,
              JSON.stringify(data, null, 2),
            );
          }
          const _results = insertData(app, data.data || [], files[i], service);
          if (!_.isEmpty(_results)) results.push(_results);
        } catch (error) {
          console.error(`Error processing ${service}:`, error);
        }
      });

      if (!_.isEmpty(results)) {
        await Promise.all(results);
      }
    } catch (error) {
      console.error("Error in insertRefData:", error.message);
    }
  });
};
const insertData = (app, existing, file, service) => {
  const dataNew = require(`./resources/${file}`);
  const inserts = [];
  if (dataNew.length === 0) return [];

  dataNew.forEach((n) => {
    for (const [key, value] of Object.entries(n)) {
      if (typeof value === "object") {
        for (const [key1, value1] of Object.entries(value)) {
          if (key1 === "$oid") n[key] = new mongoose.Types.ObjectId(value1);
          if (key1 === "$date") n[key] = value1;
        }
      }
    }
    const temp = n;
    delete temp.__v;
    delete temp.createdAt;
    delete temp.updatedAt;
    if (!_.find(existing, temp)) {
      temp["hook"] = false;
      if (typeof n._id != "undefined" && !_.find(existing, { _id: n._id }))
        inserts.push(temp);
      else if (typeof n._id === "undefined") inserts.push(temp);
    }
  });
  // moveFile(file);
  if (!_.isEmpty(inserts)) {
    return [app.service(service).create(inserts)];
  } else return [];
};
