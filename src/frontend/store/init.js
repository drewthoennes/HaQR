import axios from 'axios';
import store from '@/store';
import {
    setToken,
    setHackers,
    setUsers
} from '@/store/actions';
import socket from '@/socket';

const init = (store) => {
    let token = localStorage.getItem('token');

    if (token) {
        store.dispatch(setToken(token));

        getHackers(token);
        // getUsers(token);
    }

    socket.emit('join');

    socket.on('updateHackers', () => {
        getHackers(token);
    });

    // socket.on('updateUsers', () => {
    //     getUsers(token);
    // });
};

const getHackers = (token) => {
    axios.get('/api/hackers', {
        headers: {
          Authorization: `token ${token}`
        }
      }).then(res => {
        if (!res || !res.data || !res.data.hackers) {
            throw new Error('There was an error retrieving the hackers');
        }

        store.dispatch(setHackers(res.data.hackers));
      }).catch(err => {
      });
};

const getUsers = (token) => {
    axios.get('/api/users', {
        headers: {
          Authorization: `token ${token}`
        }
      }).then(res => {
        if (!res || !res.data || !res.data.users) {
            throw new Error('There was an error retrieving the users');
        }

        store.dispatch(setUsers(res.data.users));
      }).catch(err => {
      });
};

export default init;