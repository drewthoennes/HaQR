const middleware = require('@b/middleware');

module.exports = function(router) {
  router.get('/api/health', middleware.authorize({roles: ['admin']}), (req, res) => {
    res.json({'status': 'OK'});
  });
}
