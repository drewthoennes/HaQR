import {createStore} from 'redux';
import reducers from '@f/store/reducers';

const store = createStore(reducers);

export default store;
