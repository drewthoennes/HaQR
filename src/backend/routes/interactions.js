const interactionsController = require('@b/controllers/interaction');
const middleware = require('@b/middleware');

module.exports = function(router) {
  router.get('/api/interactions', middleware.authorize(), (req, res) => {
    interactionsController.getInteractions().then(interactions => {
      res.json({'interactions': interactions.list, 'total': interactions.total});
    }).catch(err => {
      res.json({'error': 'There was an error getting interactions: ' + err});
    });
  });

  router.delete('/api/interactions', middleware.authorize({roles: ['owner']}), (req, res) => {
    interactionsController.deleteInteractions().then(() => {
      res.json({'message': 'Successfully deleted interactions'});
    }).catch(err => {
      res.json({'error': 'There was an error deleting interactions'});
    });
  });

  router.delete('/api/interactions/:interaction_id', middleware.authorize({roles: ['owner']}), (req, res) => {
    interactionsController.deleteInteraction(req.params.interaction_id).then(() => {
      res.json({'message': 'Successfully deleted the interaction'});
    }).catch(err => {
      res.json({'error': 'There was an error deleting the interaction'});
    });
  });
}
