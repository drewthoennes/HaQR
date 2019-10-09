const utils = require('@b/utils');

exports.authorize = (config) => {
    return (req, res, next) => {
        utils.authorize(req, config).then(auth => {
            req.auth = auth;
            next();
        }).catch(err => {
            res.json({'error': err.message || err});
        });
    }
};
