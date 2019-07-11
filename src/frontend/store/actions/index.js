import {
    SET_TOKEN,
    REMOVE_TOKEN,
    SET_CONFIG,
    SET_HACKERS,
    SET_USERS,
    SET_ACCOUNT,
    SET_LOADED,
    CLEAR_ALL
 } from '@/const/store';
 
export const setToken = token => ({
    type: SET_TOKEN,
    token
});

export const removeToken = () => ({
    type: REMOVE_TOKEN
});

export const setConfig = config => ({
    type: SET_CONFIG,
    config
});

export const setHackers = hackers => ({
    type: SET_HACKERS,
    hackers
});

export const setUsers = users => ({
    type: SET_USERS,
    users
});

export const setAccount = account => ({
    type: SET_ACCOUNT,
    account
});

export const setLoaded = () => ({
    type: SET_LOADED
});

export const clearAll = () => ({
    type: CLEAR_ALL
});