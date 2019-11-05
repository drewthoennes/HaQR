const userController = require('@b/controllers/user');
const middleware = require('@b/middleware');
const {UnauthorizedError, InsufficientRoleError} = require('@b/errors');

module.exports = function(router) {
  router.get('/api/users', middleware.authorize(), (req, res) => {
    return userController.getAllUsers().then(users => {
        res.json({users: users});
    }).catch(err => {
      switch (true) {
        case err instanceof UnauthorizedError:
          res.status(401).json({'error': err.message});
          break;

        case err instanceof InsufficientRoleError:
          res.status(401).json({'error': err.message});
          break;

        default:
          res.status(500).json({'error': 'There was an error retrieving the users'});
          break;
      }
    });
  });

  router.post('/api/users/:user_id/authorize', middleware.authorize({roles: ['admin']}), (req, res) => {
    return userController.authorizeUser(req.params.user_id).then(() => {
      res.json({'message': 'Successfully toggled user authorization'});
    }).catch(err => {
      res.status(500).json({'error': 'There was an error authorizing this user'});
    });
  });


  router.post('/api/users/:user_id/role', middleware.authorize({roles: ['admin']}), (req, res) => {
    return userController.toggleUserRole(req.params.user_id).then(() => {
      res.json({'message': 'Successfully toggled user role'});
    }).catch(err => {
      res.status(500).json({'error': 'There was an error authorizing this user'});
    });
  });
}
