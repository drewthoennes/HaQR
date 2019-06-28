import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import store from '@/store';
import init from '@/store/init';
import 'bootstrap/dist/css/bootstrap.css';
import './styles.scss';

import App from '@/components/App'

ReactDOM.render((
  <Provider store={store}>
    <App/>
  </Provider>
), document.getElementById('app'));

// Start initialization script to retrieve resources
init();