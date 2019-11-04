const express = require('express');
const config = require('@/config')();

module.exports = function() {
  let router = express.Router();

  router.get('/api', (req, res) => {
    res.json({'message': `${config.name} API`});
  });

  require('./auth')(router);
  require('./hackers')(router);
  require('./users')(router);
  require('./roles')(router);
  require('./interactions')(router);
  require('./account')(router);
  require('./config')(router);
  require('./health')(router);
  require('./error')(router);

  return router;
}
