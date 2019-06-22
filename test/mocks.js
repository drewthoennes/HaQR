var mongoose = require('mongoose');

exports.resolvedPromise = data => { return Promise.resolve(data) };

exports.rejectedPromise = err => { return Promise.reject(err) };

exports.jwt = {
    user_id: '507f1f77bcf86cd799439011',
    username: 'user'
}

exports.error = Error('Generic mock error');

exports.objectId = mongoose.Types.ObjectId();

exports.genericModel = {
    find: () => { return exports.resolvedPromise(); },
    findOne: () => { return exports.resolvedPromise(); },
    findById: () => { return exports.resolvedPromise(); },
    lean: () => { return exports.resolvedPromise(); },
    select: () => { return exports.resolvedPromise(); },
    exec: () => { return exports.resolvedPromise(); },
    populate: () => { return exports.resolvedPromise(); }
}

exports.hackerModel = Object.assign(exports.genericModel, {});

exports.hacker = {
    name: 'Purdue Pete',
    email: 'pete@purdue.edu'
};

exports.mongooseStub = (sandbox, calls = [], resolution) => {
    calls = calls.reverse();

    let stub;

    // Start with exec command
    if (calls[0] === 'exec') {
        stub = {
            exec: resolution
        }
        calls = calls.slice(1, calls.length);
    }
    else {
        stub = {
            exec: resolution
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