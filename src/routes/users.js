const userController = require('@b/controllers/user');

module.exports = function(router) {
  router.get('/api/users/find', (req, res) => {
    userController.findUser(req.body.accounts)
      .then(user => {
        res.json({'message': 'Successfully retrieved user', 'user': user});
      })
      .catch(err => {
        res.status(500).json({'error': 'Unable to find a user with that id'});
      });
  });

  router.get('/api/users/:user_id', (req, res) => {
    userController.getUser(req.params.user_id)
      .then(user => {
        res.json({'message': 'Successfully retrieved user', 'user': user});
      })
      .catch(err => {
        res.status(500).json({'error': 'Unable to find a user with that id'});
      });
  });
}
  