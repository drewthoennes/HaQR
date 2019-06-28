const userController = require('@b/controllers/user');
const {authorize} = require('@b/utils');
const {UnauthorizedError, InsufficientRoleError} = require('@b/errors');

module.exports = function(router) {
  router.get('/api/users', (req, res) => {
    authorize(req, {
      roles: ['coordinator', 'admin']
    }).then(() => {
      return userController.getAllUsers()
    }).then(users => {
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

  router.get('/api/users/find', (req, res) => {
    userController.findUser(req.body.accounts).then(user => {
        res.json({'message': 'Successfully retrieved user', 'user': user});
    }).catch(err => {
      res.status(500).json({'error': 'Unable to find a user with that id'});
    });
  });

  router.get('/api/users/:user_id', (req, res) => {
    userController.getUser(req.params.user_id).then(user => {
      res.json({'message': 'Successfully retrieved user', 'user': user});
    }).catch(err => {
      res.status(500).json({'error': 'Unable to find a user with that id'});
    });
  });
}
  