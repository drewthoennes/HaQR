const {authorize} = require('@b/utils');

module.exports = function(router) {
  router.get('/api/health', (req, res) => {
    authorize(req, {
      roles: ['admin']
    }).then(() => {
      res.json({'status': 'OK'});
    }).catch(err => {
      res.json({'error': 'There was an error retrieving the current health'});
    });
  });
}
