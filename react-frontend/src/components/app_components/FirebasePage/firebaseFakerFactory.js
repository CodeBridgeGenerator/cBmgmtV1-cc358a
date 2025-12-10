import { faker } from "@faker-js/faker";
export default (user, count) => {
  let data = [];
  for (let i = 0; i < count; i++) {
    const fake = {
      projectId: faker.lorem.sentence(""),
      url: faker.lorem.sentence(""),
      customUrl: faker.lorem.sentence(""),
      key: faker.lorem.sentence(""),
      env: faker.lorem.sentence(""),
      projectNumber: faker.lorem.sentence(""),
      webApiKey: faker.lorem.sentence(""),
      appId: faker.lorem.sentence(""),

      updatedBy: user._id,
      createdBy: user._id,
    };
    data = [...data, fake];
  }
  return data;
};
