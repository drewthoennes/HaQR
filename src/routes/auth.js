const {Hacker} = require('@b/models');
const axios = require('axios');
const c = require('@b/const');

module.exports = function(router) {
  router.get('/api/auth/github', (req, res) => {
    let clientId = process.env.GITHUB_CLIENT_ID;
    let redirectUri = 'http://localhost:8080/api/auth/github/redirect'

    const url = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}`;

    res.redirect(url);
  });

  router.get('/api/auth/github/redirect', (req, res) => {
    let clientId = process.env.GITHUB_CLIENT_ID;
    let clientSecret = process.env.GITHUB_CLIENT_SECRET;

    const url = `https://github.com/login/oauth/access_token?client_id=${clientId}&client_secret=${clientSecret}&code=${req.query.code}`;

    axios.post(url).then(credentials => {
      let token = credentials.data.split('&').find(el => {
        return el.indexOf('access_token') != -1;
      }).split('=')[1];

      console.log(token);
    }).catch(err => {
      console.log('Error');
    });
  });
}
