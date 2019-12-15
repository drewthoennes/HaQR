const configController = require('@b/controllers/config');
const hackerController = require('@b/controllers/hacker');
const middleware = require('@b/middleware');

const joi = require('@hapi/joi');

const configSchema = joi.object().keys({
  config: joi.object().keys({
    authorizeAll: joi.boolean().required(),
    promoteAll: joi.boolean().required(),
    activateOnCheckin: joi.boolean().required(),
    activeOnCreate: joi.boolean().required()
  }).required()
});

module.exports = function(router) {
    router.get('/api/config', middleware.authorize(), (req, res) => {

      return configController.getConfig().then(config => {
        res.json({'config': config});
      }).catch(err => {
        res.json({'error': 'There was an error getting your configuration: ' + err});
      });
    });

    router.post('/api/config', middleware.authorize({roles: ['admin']}), middleware.validate(configSchema), (req, res) => {
      return configController.updateConfig(req.auth.account._id, req.body.config).then(() => {
        res.json({'message': 'Successfully updated the configuration'});
      }).catch(err => {
        res.json({'error': 'There was an error updating your configuration: ' + err});
      });
    });
}
