const axios = require('axios');
const userController = require('@b/controllers/user');

exports.authorize = (req) => {
    if (!req || !req.headers || !req.headers.authorization) {
        return Promise.reject('Missing authorization');
    }

    let url = 'https://api.github.com/user';

    return axios.get(url, {
        headers: {
            Authorization: req.headers.authorization
        }
    }).then(res => {
        if (!res || !res.data) {
            throw new Error('There was an error retrieving credentials');
        }

        let account = {
            github: {
                username: res.data.login // , email: res.data.email // Add email checking
            }
        };

        return userController.hasUser(account);
    }).then(has => {
        if (!has) {
            return Promise.reject('You do not have permission to access this service');
        }

        return Promise.resolve(true);
    });
};
