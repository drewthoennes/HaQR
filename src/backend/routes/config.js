const configController = require('@b/controllers/config');
const authController = require('@b/controllers/auth');

module.exports = function(router) {
    router.get('/api/config', authController.authorize(), (req, res) => {

      return configController.getConfig().then(config => {
        res.json({'config': config});
      }).catch(err => {
        res.json({'error': 'There was an error getting your configuration: ' + err});
      });
    });

    router.post('/api/config', authController.authorize({role: ['admin']}), (req, res) => {
      return configController.updateConfig(req.body.config).then(() => {
        res.json({'message': 'Successfully updated the configuration'});
      }).catch(err => {
        res.json({'error': 'There was an error updating your configuration: ' + err});
      });
    });
}
