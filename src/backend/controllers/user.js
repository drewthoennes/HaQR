const {User} = require('@b/models');
const bluebird = require('bluebird');

exports.getUser = (id) => {
    return User.findById(id).select('-_id').exec();
};

exports.findUser = (accounts) => {
    return User.findOne(accounts).exec();
}

exports.hasUser = (accounts) => {
    return User.countDocuments(accounts).exec()
        .then(count => {
            return count != 0;
        });
};