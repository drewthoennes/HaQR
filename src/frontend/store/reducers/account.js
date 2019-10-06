import {
    SET_TOKEN,
    REMOVE_TOKEN,
    SET_CONFIG,
    SET_HACKERS,
    SET_USERS,
    SET_ROLES,
    SET_ACCOUNT,
    SET_LOADED,
    CLEAR_ALL
 } from '@/const/store';

// Make sure to add these to the map
let initialState = {
    token: undefined,
    config: undefined,
    account: {
        username: undefined,
        email: undefined,
        role: undefined,
        authorized: undefined
    },
    hackers: [],
    users: [],
    roles: [],
    loaded: false
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

        case SET_CONFIG:
            return Object.assign({}, state, {
                config: action.config
            });

        case SET_HACKERS:
            return Object.assign({}, state, {
                hackers: action.hackers
            });

        case SET_USERS:
            return Object.assign({}, state, {
                users: action.users
            });

        case SET_ROLES:
            return Object.assign({}, state, {
                roles: action.roles
            });

        case SET_ACCOUNT:
            return Object.assign({}, state, {
                account: {
                    name: action.account.name,
                    email: action.account.email,
                    role: action.account.role,
                    authorized: action.account.authorized
                }
            });
        case SET_LOADED:
            return Object.assign({}, state, {
                loaded: true
            });

        case CLEAR_ALL:
            return Object.assign({}, state);

        default:
            return state
    }
}

export default account
