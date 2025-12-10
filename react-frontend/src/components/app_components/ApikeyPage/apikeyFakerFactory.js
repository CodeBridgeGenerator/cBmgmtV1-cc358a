import { faker } from "@faker-js/faker";
export default (user, count) => {
  let data = [];
  for (let i = 0; i < count; i++) {
    const fake = {
      apikey: faker.lorem.sentence(1),
      projectName: faker.lorem.sentence(1),
      requests: faker.lorem.sentence(1),
      duration: faker.lorem.sentence(1),
      serviceName: faker.lorem.sentence(1),
      active: faker.lorem.sentence(1),

      updatedBy: user._id,
      createdBy: user._id,
    };
    data = [...data, fake];
  }
  return data;
};
