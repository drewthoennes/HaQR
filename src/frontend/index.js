import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import store from '@/store';
import init from '@/store/init';
import 'bootstrap/dist/css/bootstrap.css';
import $ from 'jquery';
import Popper from 'popper.js';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import './styles.scss';
import Modal from 'react-modal';

Modal.setAppElement('#app');

import App from '@/components/App'

ReactDOM.render((
  <Provider store={store}>
    <App/>
  </Provider>
), document.getElementById('app'));

// Start initialization script to retrieve resources
init();
