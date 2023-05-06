// faker.js
const faker = require('faker');

const generateFakeUser = () => {
    return {
        name: faker.name.findName(),
        email: faker.internet.email(),
        phone: faker.phone.phoneNumber(),
    };
};

module.exports = generateFakeUser;
