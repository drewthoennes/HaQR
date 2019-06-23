const hackerController = require('@b/controllers/hacker');
const {authorize} = require('@b/utils');

module.exports = function(router) {
  router.get('/api/hackers', (req, res) => {
    authorize(req).then(() => {
      hackerController.getAllHackers()
      .then(hackers => {
        res.json({'message': 'Successfully retrieved hackers', 'hackers': hackers});
      })
      .catch(err => {
        res.status(500).json({'error': 'Unable to find a hacker with that qr code'});
      });
    }).catch(err => {
      res.json({'error': err});
    });
  });

  router.get('/api/hackers/:hacker_id', (req, res) => {
    authorize(req).then(() => {
      hackerController.getHacker(req.params.hacker_id)
      .then(hacker => {
        res.json({'message': 'Successfully retrieved hacker', 'hacker': hacker});
      })
      .catch(err => {
        res.status(500).json({'error': 'Unable to find a hacker with that qr code'});
      });
    }).catch(err => {
      res.json({'error': err});
    });
  });

  router.post('/api/hackers/:hacker_id', (req, res) => {
    authorize(req).then(() => {
      hackerController.updateHacker(req.params.hacker_id, req.body.fields)
        .then(() => {
          res.json({'message': 'Successfully updated hacker'});
        })
        .catch(err => {
          res.status(500).json({'error': 'Unable to update a hacker with that qr code'});
        });
    }).catch(err => {
      res.json({'error': err});
    });
  });
}
  