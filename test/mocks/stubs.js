const mongoose = require('mongoose');
const faker = require('faker');

exports.account = () => ({
    _id: mongoose.Types.ObjectId(),
    github: {
        username: faker.internet.userName()
    },
    name: faker.name.findName(),
    email: faker.internet.email(),
    role: 'member',
    authorized: true,
});

exports.hacker = () => ({
    _id: mongoose.Types.ObjectId(),
    name: faker.name.findName(),
    email: faker.internet.email(),
    qr: faker.random.number(),
    fields: [
        {
            name: faker.random.word(),
            attributes: [
                {
                    name: faker.random.words(),
                    had: faker.random.boolean()
                }
            ]
        }
    ],
    active: faker.random.boolean()
});

exports.role = () => ({
    _id: mongoose.Types.ObjectId(),
    name: faker.name.findName(),
    fields: [
        {
            name: faker.random.word(),
            attributes: [
                faker.random.words(),
                faker.random.words(),
                faker.random.words()
            ]
        }
    ],
});
