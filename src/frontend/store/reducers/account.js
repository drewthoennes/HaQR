import {
    SET_TOKEN,
    REMOVE_TOKEN,
    SET_HACKERS,
    SET_USERS,
    SET_ACCOUNT,
    CLEAR_ALL
 } from '@/const/store';

// Make sure to add these to the map
let initialState = {
    token: undefined,
    account: {
        username: undefined,
        email: undefined,
        role: undefined
    },
    hackers: [],
    users: []
};
  
const account = (state = initialState, action) => {
    switch (action.type) {
        case SET_TOKEN:
            return Object.assign({}, state, {
                token: action.token
            });

        case REMOVE_TOKEN:
            return Object.assign({}, state, {
                token: undefined
            });

        case SET_HACKERS:
            return Object.assign({}, state, {
                hackers: action.hackers
            });

        case SET_USERS:
            return Object.assign({}, state, {
                users: action.users
            });

        case SET_ACCOUNT:
            return Object.assign({}, state, {
                account: {
                    username: action.account.role,
                    email: action.account.email,
                    role: action.account.role,
                }
            });

        case CLEAR_ALL:
            return Object.assign({}, state);

        default:
            return state
    }
}

export default account