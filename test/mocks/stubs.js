const mongoose = require('mongoose');
const faker = require('faker');

exports.account = (isAdmin) => ({
    _id: mongoose.Types.ObjectId(),
    github: {
        username: faker.internet.userName()
    },
    name: faker.name.findName(),
    email: faker.internet.email(),
    role: isAdmin ? 'admin' : 'member',
    authorized: true,
});

exports.hacker = () => ({
    _id: mongoose.Types.ObjectId(),
    name: faker.name.findName(),
    email: faker.internet.email(),
    description: faker.random.words(),
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
    name: faker.name.findName(),
    fields: [
        {
            name: faker.random.word(),
            attributes: [
                faker.random.words(),
                faker.random.words(),
                faker.random.words()
            ]
        },
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

exports.authMiddleware = (account, authorized, config) => {
    return (req, res, next) => {
        if (config && config.roles && !config.roles.includes(account.role)) {
            res.send({'error': 'You lack the sufficient role to access this service'});
            return;
        }

        req.auth = {
            account: account,
            authorized: authorized
        }

        next();
    }
};
