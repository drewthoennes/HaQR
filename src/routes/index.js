const express = require('express');

module.exports = function() {
  let router = express.Router();

  router.get('/', (req, res) => {
    res.json({'message': 'BoilermakeQR API'});
  });

  require('./auth')(router);
  require('./hackers')(router);
  require('./health')(router);
  require('./error')(router);

  return router;
}
