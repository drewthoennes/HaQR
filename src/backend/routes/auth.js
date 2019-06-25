const {Hacker} = require('@b/models');
const axios = require('axios');
const config = require('@/config')();
const c = require('@b/const');

module.exports = function(router) {
  router.get('/api/auth/github', (req, res) => {
    let clientId = process.env.GITHUB_CLIENT_ID;
    let redirectUri = `${config.host}/api/auth/github/redirect`;

    if (req.query.mobile) {
      redirectUri += '/mobile';
    }
    else if (req.query.return) {
      redirectUri += '/login';
    }

    const url = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}`;

    if (req.query.return) {
      res.json({'url': url});
      return;
    }

    res.redirect(url);
  });

  // Used for frontend
  router.get('/api/auth/github/redirect', (req, res) => {
    let clientId = process.env.GITHUB_CLIENT_ID;
    let clientSecret = process.env.GITHUB_CLIENT_SECRET;

    const url = `https://github.com/login/oauth/access_token?client_id=${clientId}&client_secret=${clientSecret}&code=${req.query.code}`;

    axios.post(url).then(credentials => {
      let token = credentials.data.split('&').find(el => {
        return el.indexOf('access_token') != -1;
      }).split('=')[1];

      res.json({'token': token});
    }).catch(err => {
      res.json({'error': 'There was an error athenticating'});
    });
  });

  // Used for React Native application
  router.get('/api/auth/github/redirect/login', (req, res) => {
    let clientId = process.env.GITHUB_CLIENT_ID;
    let clientSecret = process.env.GITHUB_CLIENT_SECRET;

    const url = `https://github.com/login/oauth/access_token?client_id=${clientId}&client_secret=${clientSecret}&code=${req.query.code}`;

    axios.post(url).then(credentials => {
      let token = credentials.data.split('&').find(el => {
        return el.indexOf('access_token') != -1;
      }).split('=')[1];

      res.redirect(`/login?token=${token}`);
    }).catch(err => {
      res.json({'error': 'There was an error athenticating'});
    });
  });

  router.get('/api/auth/github/redirect/mobile', (req, res) => {
    let clientId = process.env.GITHUB_CLIENT_ID;
    let clientSecret = process.env.GITHUB_CLIENT_SECRET;

    const url = `https://github.com/login/oauth/access_token?client_id=${clientId}&client_secret=${clientSecret}&code=${req.query.code}`;

    axios.post(url).then(credentials => {
      let token = credentials.data.split('&').find(el => {
        return el.indexOf('access_token') != -1;
      }).split('=')[1];

      let mobileAuthRedirect = process.env.MOBILE_AUTH_REDIRECT;
      res.redirect(`${mobileAuthRedirect}?token=${token}`);
    }).catch(err => {
      let error = 'There was an error retrieving your token';
      res.redirect(`mobileAuthRedirect?token=&error=${error}`);
    });
  });
}
