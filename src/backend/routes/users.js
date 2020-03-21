const userController = require('@b/controllers/user');
const middleware = require('@b/middleware');
const {UnauthorizedError, InsufficientRoleError} = require('@b/errors');

module.exports = function(router) {
  router.get('/api/users', middleware.authorize(), (req, res) => {
    return userController.getAllUsers().then(users => {
        res.json({users: users});
    }).catch(err => {
      res.json({'error': 'There was an error retrieving the users'});
    });
  });

  router.post('/api/users/:user_id/authorize', middleware.authorize({roles: ['admin', 'owner']}), (req, res) => {
    return userController.authorizeUser(req.auth.account._id, req.params.user_id).then(() => {
      res.json({'message': 'Successfully toggled user authorization'});
    }).catch(err => {
      res.json({'error': 'There was an error authorizing this user'});
    });
  });

  router.post('/api/users/:user_id/role', middleware.authorize({roles: ['admin', 'owner']}), (req, res) => {
    return userController.toggleUserRole(req.auth.account._id, req.params.user_id).then(() => {
      res.json({'message': 'Successfully toggled user role'});
    }).catch(err => {
      res.json({'error': 'There was an error changing the role of this user'});
    });
  });

  router.post('/api/users/:user_id/ownership', middleware.authorize({roles: ['owner']}), (req, res) => {
    return userController.transferOwnership(req.auth.account._id, req.params.user_id).then(() => {
      res.json({'message': 'Successfully transfered ownership'});
    }).catch(err => {
      res.json({'error': 'There was an error transfering ownership'});
    });
  });
}
