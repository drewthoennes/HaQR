import axios from 'axios';
import store from '@f/store';
import {
    setToken,
    setConfig,
    setAccount,
    setHackers,
    setUsers,
    setRoles,
    setLoaded
} from '@f/store/actions';
import socket from '@f/socket';
import {authorize} from '@f/utils';
import history from '@f/router/history';

const init = () => {
    let token = localStorage.getItem('token');
    let promises = [];

    if (token) {
        store.dispatch(setToken(token));

        promises.push(getAccount(token));
        promises.push(getConfig(token));
        promises.push(getHackers(token));
        promises.push(getUsers(token));
        promises.push(getRoles(token));
    }

    return Promise.all(promises).then(() => {
      store.dispatch(setLoaded());

      socket.emit('join', token);

      socket.on('updateConfig', () => {
        getConfig(token);
      });

      socket.on('updateHackers', () => {
          getHackers(token);
      });

      socket.on('updateUsers', () => {
          getUsers(token);
      });

      socket.on('updateRoles', () => {
        getRoles(token);
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

const getConfig = (token) => {
  return axios.get('/api/config', {
    headers: {
      authorization: `token ${token}`
    }
  }).then(res => {
    if (!res || !res.data || !res.data.config) {
        throw new Error('There was an error retrieving the config');
    }

    store.dispatch(setConfig(res.data.config));
  }).catch(err => {
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

const getRoles = (token) => {
  return axios.get('/api/roles', {
    headers: {
      authorization: `token ${token}`
    }
  }).then(res => {
    if (!res || !res.data || !res.data.roles) {
        throw new Error('There was an error retrieving roles');
    }

    store.dispatch(setRoles(res.data.roles));
  }).catch(err => {
    getAccount(token).then(() => {
      authorize(history);
    });
  });
};

export default init;
