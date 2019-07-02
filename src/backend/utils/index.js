const axios = require('axios');
const userController = require('@b/controllers/user');
const {UnauthorizedError, InsufficientRoleError} = require('@b/errors');

exports.authorize = (req, params = {}) => {
    if (!req || !req.headers || !req.headers.authorization) {
        return Promise.reject('Missing authorization');
    }

    let url = 'https://api.github.com/user';
    let githubData;

    return axios.get(url, {
        headers: {
            Authorization: req.headers.authorization
        }
    }).then(res => {
        if (!res || !res.data) {
            throw new UnauthorizedError('There was an error retrieving credentials');
        }

        githubData = res.data;

        let account = {
            github: {
                username: res.data.login // , email: res.data.email // Add email checking
            }
        };

        return userController.findOrCreateUser(account, res.data.name, res.data.email, res.data.login);
    }).then(user => {
        if (!user || !user.authorized) {
            throw new UnauthorizedError('You do not have permission to access this service');
        }

        if (params.roles && !params.roles.includes(user.role)) {
            throw new InsufficientRoleError('You lack a sufficient role to access this service');
        }

        if (params.account) {
            return user;
        }

        return true;
    });
};
