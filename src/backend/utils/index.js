const axios = require('axios');
const userController = require('@b/controllers/user');
const configController = require('@b/controllers/config');
const {UnauthorizedError, InsufficientRoleError} = require('@b/errors');

exports.authorize = (req, params = {}) => {
    if (!req || !req.headers || !req.headers.authorization) {
        return Promise.reject('Missing authorization');
    }

    let url = 'https://api.github.com/user';
    let config;

    return configController.getConfig().then(configuration => {
        config = configuration;
        return axios.get(url, {
            headers: {
                Authorization: req.headers.authorization
            }
        });
    }).then(res => {
        if (!res || !res.data) {
            throw new UnauthorizedError('There was an error retrieving credentials');
        }

        let account = {
            github: {
                username: res.data.login // , email: res.data.email // Add email checking
            }
        };

        return userController.findOrCreateUser(account, res.data.name, res.data.email, res.data.login, config.authorizeAll, config.promoteAll);
    }).then(user => {
        let authorized = true;

        if (!user || !user.authorized) {
            if (!params.force) {
                throw new UnauthorizedError('You do not have permission to access this service');
            }

            authorized = false;
        }

        if (params.roles && !params.roles.includes(user.role)) {

            if (!params.force) {
                throw new InsufficientRoleError('You lack the sufficient role to access this service');
            }

            authorized = false;
        }

        if (params.account) {
            return {
                authorized: authorized,
                account: user
            };
        }

        return {
            authorized: authorized
        };
    });
};
