const {User} = require('@b/models');
const bluebird = require('bluebird');

exports.getUser = (id) => {
    return User.findById(id).select('-_id -github').exec();
};

exports.getAllUsers = () => {
    return User.find().select('-github').exec();
};

exports.createUnauthorizedUser = (name, email, github) => {
    let user = new User({
        name: name,
        email: email,
        github: {
            username: github
        },
        role: 'member',
        authorized: false
    });

    return user.save();
};

exports.findUser = (accounts) => {
    return User.findOne(accounts).exec();
};

exports.findOrCreateUser = (accounts, name, email, github) => {
    return User.findOne(accounts).exec()
        .then(user => {
            if (!user) {
                let newUser = new User({
                    name: name,
                    email: email,
                    github: {
                        username: github
                    },
                    role: 'member',
                    authorized: false
                });

                return newUser.save();
            }

            return user;
        });
};

exports.hasUser = (accounts) => {
    return User.countDocuments(accounts).exec()
        .then(count => {
            return count != 0;
        });
};

exports.authorizeUser = (id) => {
    return User.findById(id).then(user => {
        return User.findByIdAndUpdate(id, {
            $set: {
                authorized: !user.authorized
            }
        });
    });
};

exports.toggleUserRole = (id) => {
    return User.findById(id).then(user => {
        return User.findByIdAndUpdate(id, {
            $set: {
                role: user.role === 'admin' ? 'member' : 'admin'
            }
        });
    });
};