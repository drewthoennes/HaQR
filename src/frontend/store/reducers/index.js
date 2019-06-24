import {combineReducers} from 'redux';
import account from './account.js';

const reducers = combineReducers({
    account: account
});

export default reducers;