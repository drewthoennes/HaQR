import axios from 'axios';
import store from '@/store';
import {
    setToken,
    setAccount,
    setHackers,
    setUsers
} from '@/store/actions';
import socket from '@/socket';

const init = () => {
    let token = localStorage.getItem('token');

    if (token) {
        store.dispatch(setToken(token));

        getAccount(token);
        getHackers(token);
        getUsers(token);
    }
    else {
      console.error('No token found to retrieve your account with...');
    }

    socket.emit('join');

    socket.on('updateHackers', () => {
        getHackers(token);
    });

    socket.on('updateUsers', () => {
        getUsers(token);
    });
};

const getAccount = (token) => {
  axios.get('/api/account', {
    headers: {
      authorization: `token ${token}`
    }
  }).then(res => {
    if (!res || !res.data || !res.data.account) {
      throw new Error('There was an error retrieving your account');
    }

    store.dispatch(setAccount(res.data.account));
  }).catch(err => {
    console.log(err);
  });
};

const getHackers = (token) => {
    axios.get('/api/hackers', {
        headers: {
          authorization: `token ${token}`
        }
      }).then(res => {
        if (!res || !res.data || !res.data.hackers) {
            throw new Error('There was an error retrieving the hackers');
        }

        store.dispatch(setHackers(res.data.hackers));
      }).catch(err => {
        console.error(err);
      });
};

const getUsers = (token) => {
    axios.get('/api/users', {
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

        if (!account) {
          console.error('Your account was not found while updating the users');
          return;
        }

        store.dispatch(setAccount(account));
      }).catch(err => {
        console.error(err);
      });
};

export default init;