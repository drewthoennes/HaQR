module.exports = function(router) {
  router.get('/api*', (req, res) => {
    res.json({'error': 'Endpoint not found'});
  });
  router.post('/api*', (req, res) => {
    res.json({'error': 'Endpoint not found'});
  });
  router.put('/api*', (req, res) => {
    res.json({'error': 'Endpoint not found'});
  });
  router.delete('/api*', (req, res) => {
    res.json({'error': 'Endpoint not found'});
  });

  router.get('/*', (req, res) => {
    res.json({'error': 'Endpoint not built'});
  });
  router.post('/*', (req, res) => {
    res.json({'error': 'Endpoint not built'});
  });
  router.put('/*', (req, res) => {
    res.json({'error': 'Endpoint not built'});
  });
  router.delete('/*', (req, res) => {
    res.json({'error': 'Endpoint not built'});
  });
}
