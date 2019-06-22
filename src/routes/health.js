module.exports = function(router) {
  router.get('/health', (req, res) => {
    res.json({'status': 'OK'});
  });
}
