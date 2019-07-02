import store from '@/store';

function authorize(history) {
    let state = store.getState().account;

    if (state.loaded && !state.account.name) { // Account doesn't exist in database
        history.push('/unauthorized');
    }
    else if (state.account.authorized === false) {
        history.push('/unauthorized');
        return false;
    }

    return true;
}

function parseQuery(query) {
    if (!query) {
        return '';
    }

    return query.replace(/\?/g, '').split('&');
}

function capitalizeFirst(word) {
    if (!word) {
        return '';
    }

    return word.charAt(0).toUpperCase() + word.slice(1);
}

function sortByProperty(property) {
    // Can be a problem if this delimiter is ever used in a variable name
    let properties = property.split('.');

    return (a, b) => {
        let alpha = a;
        let beta = b;

        // Iteratively apply properties
        properties.forEach(property => {
            alpha = alpha[property];
            beta = beta[property];
        });

        if (alpha > beta) {
            return 1;
        }
        else if (alpha < beta) {
            return -1;
        }

        return 0;
    }
}

export {
    authorize,
    parseQuery,
    capitalizeFirst,
    sortByProperty
};