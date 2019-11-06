const {User} = require('@b/models');
const interactionsController = require('@b/controllers/interaction');
const c = require('@b/const');

exports.countAuthorizedUsers = () => {
    return User.countDocuments({authorized: true}).exec();
};

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

exports.findOrCreateUser = (accounts, name, email, github, authorized = false, promoted = false) => {
    let totalUsers;

    return exports.countAuthorizedUsers().then(count => {
        totalUsers = count;

        return User.findOne(accounts).exec()
    }).then(user => {
        if (!user) {
            let newUser = new User({
                name: name,
                email: email,
                github: {
                    username: github
                },
                role: promoted ? 'admin' : 'member',
                authorized: authorized
            });

            if (totalUsers === 0) {
                newUser.role = 'admin';
                newUser.authorized = true;
            }

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

exports.authorizeUser = (user_id, id) => {
    return User.findById(id).then(user => {
        return User.findByIdAndUpdate(id, {
            $set: {
                authorized: !user.authorized
            }
        });
    }).then(user => {
        if (!user.authorized) {
            return interactionsController.createInteraction(`Authorized ${user.name}`, c.interactions.OTHER, user_id);
        }
        else {
            return interactionsController.createInteraction(`Deauthorized ${user.name}`, c.interactions.OTHER, user_id);
        }
    });
};

exports.toggleUserRole = (user_id, id) => {
    return User.findById(id).then(user => {
        return User.findByIdAndUpdate(id, {
            $set: {
                role: user.role === 'admin' ? 'member' : 'admin'
            }
        });
    }).then(user => {
        if (user.role === 'admin') {
            return interactionsController.createInteraction(`Promoted ${user.name} to admin`, c.interactions.OTHER, user_id);
        }
        else {
            return interactionsController.createInteraction(`Demoted ${user.name} to admin`, c.interactions.OTHER, user_id);
        }
    });
};
