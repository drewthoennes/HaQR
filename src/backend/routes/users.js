const userController = require('@b/controllers/user');
const middleware = require('@b/middleware');
const {UnauthorizedError, InsufficientRoleError} = require('@b/errors');

module.exports = function(router) {
  router.get('/api/users', middleware.authorize(), (req, res) => {
    return userController.getAllUsers().then(users => {
        res.json({users: users});
    }).catch(err => {
      res.status(500).json({'error': 'There was an error retrieving the users'});
    });
  });

  router.post('/api/users/:user_id/authorize', middleware.authorize({roles: ['admin']}), (req, res) => {
    return userController.authorizeUser(req.auth.account._id, req.params.user_id).then(() => {
      res.json({'message': 'Successfully toggled user authorization'});
    }).catch(err => {
      res.status(500).json({'error': 'There was an error authorizing this user'});
    });
  });


  router.post('/api/users/:user_id/role', middleware.authorize({roles: ['admin']}), (req, res) => {
    return userController.toggleUserRole(req.auth.account._id, req.params.user_id).then(() => {
      res.json({'message': 'Successfully toggled user role'});
    }).catch(err => {
      res.status(500).json({'error': 'There was an error authorizing this user'});
    });
  });
}
