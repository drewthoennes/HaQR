const mongoose = require('mongoose');
const faker = require('faker');
const promise = require('./promise');

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
    active: faker.random.boolean(),
    save: () => { return promise.resolve() }
});

exports.role = () => ({
    name: faker.random.word(),
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
    randomFields: function() { // Creates fields with random boolean values
        let random = [];

        for (let field in this.fields) {
            let temp = {};

            temp.name = this.fields[field].name;
            temp.attributes = [];

            for (let attrib in this.fields[field].attributes) {

                temp.attributes.push({
                    name: this.fields[field].attributes[attrib],
                    had: faker.random.boolean()
                });
            }

            random.push(temp);
        }

        return random;
    }
});

exports.config = () => ({
    authorizeAll: false,
    promoteAll: false,
    activateOnCheckin: true,
    activeOnCreate: false
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
