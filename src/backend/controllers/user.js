const {User} = require('@b/models');

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