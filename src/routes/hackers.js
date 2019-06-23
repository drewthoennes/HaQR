const hackerController = require('@b/controllers/hacker');

module.exports = function(router) {
  router.get('/api/hackers', (req, res) => {
    hackerController.getAllHackers()
      .then(hackers => {
        res.json({'message': 'Successfully retrieved hackers', 'hackers': hackers});
      })
      .catch(err => {
        res.status(500).json({'error': 'Unable to find a hacker with that qr code'});
      });
  });

  router.get('/api/hackers/:hacker_id', (req, res) => {
    hackerController.getHacker(req.params.hacker_id)
      .then(hacker => {
        res.json({'message': 'Successfully retrieved hacker', 'hacker': hacker});
      })
      .catch(err => {
        res.status(500).json({'error': 'Unable to find a hacker with that qr code'});
      });
  });

  router.post('/api/hackers/:hacker_id', (req, res) => {
    hackerController.updateHacker(req.params.hacker_id, req.body.fields)
      .then(() => {
        res.json({'message': 'Successfully updated hacker'});
      })
      .catch(err => {
        res.status(500).json({'error': 'Unable to update a hacker with that qr code'});
      });
  });
}
  