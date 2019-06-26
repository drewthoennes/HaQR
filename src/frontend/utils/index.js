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

export {
    parseQuery,
    capitalizeFirst
};