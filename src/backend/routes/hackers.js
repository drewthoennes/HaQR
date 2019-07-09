const hackerController = require('@b/controllers/hacker');
const {authorize} = require('@b/utils');
const {UnauthorizedError, InsufficientRoleError} = require('@b/errors');

module.exports = function(router) {
  router.get('/api/hackers', (req, res) => {
    authorize(req).then(() => {
      return hackerController.getAllHackers()
    }).then(hackers => {
      res.json({'message': 'Successfully retrieved hackers', 'hackers': hackers});
    }).catch(err => {
      switch (true) {
        case err instanceof UnauthorizedError:
          res.status(401).json({'error': err.message});
          break;

        case err instanceof InsufficientRoleError:
          res.status(401).json({'error': err.message});
          break;

        default:
            res.status(500).json({'error': 'There was an error retrieving the hackers'});
          break;
      }
    });
  });

  router.post('/api/hackers', (req, res) => {
    authorize(req, {
      role: ['admin']
    }).then(() => {
      return hackerController.createHacker(req.body.name, req.body.email, req.body.qr, req.body.fields);
    }).then(() => {
      res.json({'message': 'Successfully created hacker'});
    }).catch(err => {
      switch (true) {
        case err instanceof UnauthorizedError:
          res.status(401).json({'error': err.message});
          break;

        case err instanceof InsufficientRoleError:
          res.status(401).json({'error': err.message});
          break;

        default:
            res.status(500).json({'error': 'Unable to create hacker'});
          break;
      }
    });
  });

  router.get('/api/hackers/:hacker_id', (req, res) => {
    authorize(req).then(() => {
      return hackerController.getHacker(req.params.hacker_id)
    }).then(hacker => {
      res.json({'message': 'Successfully retrieved hacker', 'hacker': hacker});
    }).catch(err => {
      res.status(500).json({'error': 'Unable to find a hacker with that qr code'});
    }).catch(err => {
      switch (true) {
        case err instanceof UnauthorizedError:
          res.status(401).json({'error': err.message});
          break;

        case err instanceof InsufficientRoleError:
          res.status(401).json({'error': err.message});
          break;

        default:
            res.status(500).json({'error': 'Unable to find a hacker with that qr code'});
          break;
      }
    });
  });

  router.post('/api/hackers/:hacker_id', (req, res) => {
    authorize(req).then(() => {
      return hackerController.updateHacker(req.params.hacker_id, req.body.fields)
    }).then(() => {
      return res.json({'message': 'Successfully updated hacker'});
    }).catch(err => {
      return res.status(500).json({'error': 'Unable to update a hacker with that qr code'});
    }).catch(err => {
      switch (true) {
        case err instanceof UnauthorizedError:
          res.status(401).json({'error': err.message});
          break;

        case err instanceof InsufficientRoleError:
          res.status(401).json({'error': err.message});
          break;

        default:
            res.status(500).json({'error': 'Unable to find a hacker with that qr code'});
          break;
      }
    });
  });

  router.post('/api/hackers/:hacker_id/active', (req, res) => {
    authorize(req, {
      role: ['admin']
    }).then(() => {
      return hackerController.toggleActive(req.params.hacker_id);
    }).then(() => {
      res.json({'message': 'Successfully updated the hacker'})
    }).catch(err => {
      switch (true) {
        case err instanceof UnauthorizedError:
          res.status(401).json({'error': err.message});
          break;

        case err instanceof InsufficientRoleError:
          res.status(401).json({'error': err.message});
          break;

        default:
            res.status(500).json({'error': 'Unable to find a hacker with that qr code'});
          break;
      }
    });
  });
}
  