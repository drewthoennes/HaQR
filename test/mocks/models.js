const mongoose = require('mongoose');
const faker = require('faker');
const promise = require('./promise');

exports.genericModal = class GenericModal {
    constructor() {
    }

    save() {
        console.log('Saving');
        return promise.resolve();
    }
};

Object.assign(exports.genericModal, {
    find: () => { return promise.resolve(); },
    findOne: () => { return promise.resolve(); },
    findById: () => { return promise.resolve(); },
    findOneAndUpdate: () => { return promise.resolve(); },
    lean: () => { return promise.resolve(); },
    select: () => { return promise.resolve(); },
    exec: () => { return promise.resolve(); },
    populate: () => { return promise.resolve(); }
});

exports.hacker = class Hacker extends exports.genericModal {};

exports.user = class User extends exports.genericModal {};

exports.config = class Config extends exports.genericModal {};
