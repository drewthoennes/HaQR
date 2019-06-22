module.exports = function(router) {
  router.get('/*', (req, res) => {
    res.json({'error': 'Endpoint not found'});
  });
  router.post('/*', (req, res) => {
    res.json({'error': 'Endpoint not found'});
  });
  router.put('/*', (req, res) => {
    res.json({'error': 'Endpoint not found'});
  });
  router.delete('/*', (req, res) => {
    res.json({'error': 'Endpoint not found'});
  });
}
