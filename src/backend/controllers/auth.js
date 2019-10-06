const utils = require('@b/utils');

exports.authorize = (config) => {
    return (req, res, next) => {
        utils.authorize(req, config).then(res => {
            req.auth = res;
            next();
        }).catch(err => {
            res.json({'error': err.message});
        });
    }
};
