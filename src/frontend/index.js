import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import store from '@f/store';
import init from '@f/store/init';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/js/dist/button';
import 'bootstrap/js/dist/modal';
import './styles.scss';
import Modal from 'react-modal';

Modal.setAppElement('#app');

import App from '@f/components/App'

ReactDOM.render((
  <Provider store={store}>
    <App/>
  </Provider>
), document.getElementById('app'));

// Start initialization script to retrieve resources
init();
