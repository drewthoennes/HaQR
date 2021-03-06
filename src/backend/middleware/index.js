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

exports.validate = (schema) => {
        return (req, res, next) => {
            let err = schema.validate(req.body).error;
            if (err != null) {
                res.send({'error': 'Invalid fields: ' + err});
                return;
            }

            next();
       };
}
