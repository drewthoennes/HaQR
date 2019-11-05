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
}
