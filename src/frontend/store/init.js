import {setToken} from '@/store/actions';

const init = (store) => {
    let token = localStorage.getItem('token');

    if (token) {
        store.dispatch(setToken(token));
    }
};

export default init;