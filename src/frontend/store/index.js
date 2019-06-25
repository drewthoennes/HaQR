import {createStore} from 'redux';
import reducers from '@/store/reducers';
import init from '@/store/init';

const store = createStore(reducers);

init(store);

export default store;