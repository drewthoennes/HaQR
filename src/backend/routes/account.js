const middleware = require('@b/middleware');

module.exports = function(router) {
    router.get('/api/account', middleware.authorize({account: true, force: true}), (req, res) => {
      res.json({account: {
          name: req.auth.account.name,
          email: req.auth.account.email,
          role: req.auth.account.role,
          authorized: req.auth.account.authorized
      }});
    });
}
