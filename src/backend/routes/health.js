const authController = require('@b/controllers/auth');

module.exports = function(router) {
  router.get('/api/health', authController.authorize({roles: ['admin']}), (req, res) => {
    res.json({'status': 'OK'});
  });
}
