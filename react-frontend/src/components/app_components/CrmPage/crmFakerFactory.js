import { faker } from "@faker-js/faker";
export default (user, count, companyIds, personIds, opportunityIds) => {
  let data = [];
  for (let i = 0; i < count; i++) {
    const fake = {
      name: faker.lorem.sentence(1),
      company: companyIds[i % companyIds.length],
      person: personIds[i % personIds.length],
      opportunity: opportunityIds[i % opportunityIds.length],
      appCost: faker.lorem.sentence(1),
      supportCost: faker.lorem.sentence(1),
      otherCost: faker.lorem.sentence(1),

      updatedBy: user._id,
      createdBy: user._id,
    };
    data = [...data, fake];
  }
  return data;
};
