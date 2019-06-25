import {
    SET_TOKEN,
    REMOVE_TOKEN
 } from '@/const/store';

let initialState = {
    token: undefined
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

        default:
            return state
    }
}

export default account