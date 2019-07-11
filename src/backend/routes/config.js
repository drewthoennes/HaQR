const configController = require('@b/controllers/config');
const {authorize} = require('@b/utils');

module.exports = function(router) {
    router.get('/api/config', (req, res) => {
      authorize(req).then(() => {
        return configController.getConfig();
      }).then(config => {
        res.json({'config': config});
      }).catch(err => {
        res.status(401).json({'error': 'There was an error authenticating your request'});
      });
    });

    router.post('/api/config', (req, res) => {
      authorize(req, {
        role: ['admin']
      }).then(() => {
        return configController.updateConfig(req.body.config);
      }).then(() => {
        res.json({'message': 'Successfully updated the configuration'});
      }).catch(err => {
        res.status(401).json({'error': 'There was an error authenticating your request'});
      });
    });
}