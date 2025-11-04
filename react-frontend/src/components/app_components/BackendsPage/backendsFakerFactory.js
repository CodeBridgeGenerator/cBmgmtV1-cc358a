
import { faker } from "@faker-js/faker";
export default (user,count,frontendIds,contractIds) => {
    let data = [];
    for (let i = 0; i < count; i++) {
        const fake = {
projectName: faker.lorem.sentence(1),
port: faker.lorem.sentence(1),
domain: faker.lorem.sentence(1),
env: faker.lorem.sentence(1),
frontend: frontendIds[i % frontendIds.length],
contract: contractIds[i % contractIds.length],
dir: faker.lorem.sentence(1),

updatedBy: user._id,
createdBy: user._id
        };
        data = [...data, fake];
    }
    return data;
};
