const interactionsController = require('@b/controllers/interaction');

module.exports = function(router) {
  router.get('/api/interactions', (req, res) => {
    interactionsController.getInteractions().then(interactions => {
      res.json({'interactions': interactions.list, 'total': interactions.total});
    }).catch(err => {
      res.json({'error': 'There was an error getting interactions: ' + err});
    });
  });
}
