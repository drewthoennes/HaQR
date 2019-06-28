import {
    SET_TOKEN,
    REMOVE_TOKEN,
    SET_HACKERS,
    SET_USERS,
    CLEAR_ALL
 } from '@/const/store';
 
export const setToken = token => ({
    type: SET_TOKEN,
    token
});

export const removeToken = () => ({
    type: REMOVE_TOKEN
});

export const setHackers = hackers => ({
    type: SET_HACKERS,
    hackers
});

export const setUsers = users => ({
    type: SET_USERS,
    users
});

export const clearAll = () => ({
    type: CLEAR_ALL
});