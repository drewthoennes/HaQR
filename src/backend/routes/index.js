const express = require('express');

module.exports = function() {
  let router = express.Router();

  router.get('/api', (req, res) => {
    res.json({'message': 'BoilermakeQR API'});
  });

  require('./auth')(router);
  require('./hackers')(router);
  require('./users')(router);
  require('./health')(router);
  require('./error')(router);

  return router;
}