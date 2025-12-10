import { faker } from "@faker-js/faker";
export default (user, count, firebaseIds) => {
  let data = [];
  for (let i = 0; i < count; i++) {
    const fake = {
      projectName: faker.lorem.sentence(1),
      domain: faker.lorem.sentence(1),
      env: faker.lorem.sentence(1),
      firebase: firebaseIds[i % firebaseIds.length],

      updatedBy: user._id,
      createdBy: user._id,
    };
    data = [...data, fake];
  }
  return data;
};
