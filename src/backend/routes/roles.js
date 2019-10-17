const rolesController = require('@b/controllers/role');
const middleware = require('@b/middleware');

module.exports = function(router) {
  router.get('/api/roles', middleware.authorize({roles: ['admin']}), (req, res) => {
    rolesController.getRoles().then(roles => {
      res.json({'roles': roles});
    }).catch(err => {
      res.json({'error': 'There was an error getting roles: ' + err});
    });
  });

  router.post('/api/roles', middleware.authorize({roles: ['admin']}), (req, res) => {
    rolesController.createRole(req.body.name, req.body.fields).then(() => {
      res.json({'message': 'Successfully created role'});
    }).catch(err => {
      res.json({'error': 'There was an error creating this role: ' + err});
    });
  });

  router.post('/api/roles/:role_id', middleware.authorize({roles: ['admin']}), (req, res) => {
    rolesController.updateRole(req.params.role_id, req.body.name, req.body.fields).then(() => {
      res.json({'message': 'Successfully updated role'});
    }).catch(err => {
      res.json({'error': 'There was an error updating role: ' + err});
    });
  });

  router.delete('/api/roles/:role_id', middleware.authorize({roles: ['admin']}), (req, res) => {
    rolesController.deleteRole(req.params.role_id).then(() => {
      res.json({'message': 'Successfully deleted role'});
    }).catch(err => {
      res.json({'error': 'There was an error deleting role: ' + err});
    });
  });
}
