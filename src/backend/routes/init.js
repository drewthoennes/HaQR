const middleware = require('@b/middleware');
const configController = require('@b/controllers/config');
const hackerController = require('@b/controllers/hacker');
const interactionsController = require('@b/controllers/interaction');
const rolesController = require('@b/controllers/role');
const userController = require('@b/controllers/user');

module.exports = function(router) {
  router.get('/api/init', middleware.authorize(), (req, res) => {
    let data = {};

    data.account = req.auth.account ? {
        name: req.auth.account.name,
        email: req.auth.account.email,
        role: req.auth.account.role,
        authorized: req.auth.account.authorized
    } : {};

    return configController.getConfig().then(config => {
        data.config = config;

        return hackerController.getAllHackers();
    }).then(hackers => {
        data.hackers = hackers;

        return userController.getAllUsers();
    }).then(users => {
        data.users = users;

        return rolesController.getRoles();
    }).then(roles => {
        data.roles = roles;

        return interactionsController.getInteractions();
    }).then(interactions => {
        data.interactions = {
            interactions: interactions.list,
            total: interactions.total
        }

        res.json(data);
    }).catch(err => {
        res.json({'error': 'There was an error getting your configuration: ' + err});
    });
  });
}
