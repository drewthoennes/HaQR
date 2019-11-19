const axios = require('axios');
const userController = require('@b/controllers/user');
const configController = require('@b/controllers/config');
const authController = require('@b/controllers/auth');
const {UnauthorizedError, InsufficientRoleError} = require('@b/errors');

exports.authorize = async (req, params = {}) => {
    // Check for token
    if (!req || !req.headers || !req.headers.authorization) {
        return Promise.reject('Missing authorization');
    }

    let githubAuthEndpoint = 'https://api.github.com/user';
    let config = await configController.getConfig();

    // Split the token if it was sent as "token ..."
    let segments = req.headers.authorization.split(' ');
    let jwt = segments[segments.length > 1 ?  1 : 0];

    // Decode the JWT
    return authController.decodeJWT(jwt).then(decoded => {
        if (!decoded.githubToken) {
            throw new UnauthorizedError('The provided token is invalid');
        }

        // Get the Github account associated with the Github token
        return axios.get(githubAuthEndpoint, {
            headers: {
                Authorization: `token ${decoded.githubToken}`
            }
        });
    }).then(res => {
        if (!res || !res.data) {
            throw new UnauthorizedError('There was an error retrieving credentials');
        }

        return userController.findOrCreateUser({github: {username: res.data.login}}, res.data.name, res.data.email, res.data.login, config.authorizeAll, config.promoteAll);
    }).then(user => {
        let authorized = true;

        // Check user authorization
        if (!user || !user.authorized) {
            if (!params.force) {
                throw new UnauthorizedError('You do not have permission to access this service');
            }

            authorized = false;
        }

        // Check if user has required role
        if (params.roles && !params.roles.includes(user.role)) {
            if (!params.force) {
                throw new InsufficientRoleError('You lack the sufficient role to access this service');
            }

            authorized = false;
        }

        return {
            authorized: authorized,
            account: user
        };
    });
};
