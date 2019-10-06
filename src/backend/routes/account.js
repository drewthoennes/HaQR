const authController = require('@b/controllers/auth');

module.exports = function(router) {
    router.get('/api/account', authController.authorize({account: true, force: true}), (req, res) => {
      res.json({account: {
          name: req.auth.account.name,
          email: req.auth.account.email,
          role: req.auth.account.role,
          authorized: req.auth.account.authorized
      }});
    });
}
