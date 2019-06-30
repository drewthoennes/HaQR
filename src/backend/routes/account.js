const hackerController = require('@b/controllers/hacker');
const {authorize} = require('@b/utils');

module.exports = function(router) {
    router.get('/api/account', (req, res) => {
      authorize(req, {
        account: true
      }).then(account => {
        res.json({account: {
            name: account.name,
            email: account.email,
            role: account.role,
            authorized: account.authorized
        }});
      }).catch(err => {
        res.status(401).json({'error': 'There was an error authenticating your request'});
      });
    });
}