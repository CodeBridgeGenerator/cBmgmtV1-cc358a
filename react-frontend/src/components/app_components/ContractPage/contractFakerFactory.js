
import { faker } from "@faker-js/faker";
export default (user,count,crmIds) => {
    let data = [];
    for (let i = 0; i < count; i++) {
        const fake = {
crm: crmIds[i % crmIds.length],
po: faker.date.past(""),
start: faker.date.past(""),
uatDate: faker.date.past(""),
migrationDate: faker.date.past(""),
supportDate: faker.date.past(""),

updatedBy: user._id,
createdBy: user._id
        };
        data = [...data, fake];
    }
    return data;
};
