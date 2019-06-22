const {Hacker} = require('@b/models');

module.exports = function(router) {
  router.get('/hackers/:hacker_id', (req, res) => {
    res.json({'status': 'OK'});
  });
}
  