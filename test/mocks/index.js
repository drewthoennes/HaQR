const mongoose = require('mongoose');
const faker = require('faker');

exports.jwt = () => ({
    user_id: '507f1f77bcf86cd799439011',
    username: faker.internet.userName()
});

exports.error = Error('Generic mock error');

exports.objectId = mongoose.Types.ObjectId();

exports.hacker = () => ({
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

exports.mongooseStub = (sandbox, calls = [], resolution) => {
    calls = calls.reverse();

    let stub;

    // Start with exec command
    if (calls[0] === 'exec') {
        stub = {
            exec: sandbox.stub().returns(resolution)
        }
        calls = calls.slice(1, calls.length);
    }
    else {
        stub = {
            exec: sandbox.stub().returns(resolution)
        }
    }

    // Wrap each subsequent calls in new call
    calls.forEach(call => {
        stub = {
            [call]: sandbox.stub().returns(stub)
        }
    });

    return stub;
};

exports.models = require('./models');
exports.promise = require('./promise');