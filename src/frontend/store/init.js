import axios from 'axios';
import bluebird from 'bluebird';
import store from '@/store';
import {
    setToken,
    setAccount,
    setHackers,
    setUsers,
    setLoaded
} from '@/store/actions';
import socket from '@/socket';
import {authorize} from '@/utils';
import history from '@/router/history';

const init = () => {
    let token = localStorage.getItem('token');
    let promises = [];

    if (token) {
        store.dispatch(setToken(token));

        promises.push(getAccount(token));
        promises.push(getHackers(token));
        promises.push(getUsers(token));
    }

    return bluebird.all(promises).then(() => {
      store.dispatch(setLoaded());

      socket.emit('join', token);

      socket.on('updateHackers', () => {
          getHackers(token);
      });

      socket.on('updateUsers', () => {
          getUsers(token);
      });
    }).catch();
};

const getAccount = (token) => {
  return axios.get('/api/account', {
    headers: {
      authorization: `token ${token}`
    }
  }).then(res => {
    if (!res || !res.data || !res.data.account) {
      throw new Error('There was an error retrieving your account');
    }

    store.dispatch(setAccount(res.data.account));
  }).catch(err => {
    authorize(history);
  });
};

const getHackers = (token) => {
  return axios.get('/api/hackers', {
    headers: {
      authorization: `token ${token}`
    }
  }).then(res => {
    if (!res || !res.data || !res.data.hackers) {
        throw new Error('There was an error retrieving the hackers');
    }

    store.dispatch(setHackers(res.data.hackers));
  }).catch(err => {
    getAccount(token).then(() => {
      authorize(history);
    });
  });
};

const getUsers = (token) => {
  return axios.get('/api/users', {
    headers: {
      authorization: `token ${token}`
    }
  }).then(res => {
    if (!res || !res.data || !res.data.users) {
        throw new Error('There was an error retrieving the users');
    }

    store.dispatch(setUsers(res.data.users));
    let email = store.getState().account.account.email;

    let account = res.data.users.find(user => {
      return user.email === email;
    });

    if (account) {
      store.dispatch(setAccount(account));
    }
  }).catch(err => {
    getAccount(token).then(() => {
      authorize(history);
    });
  });
};

export default init;