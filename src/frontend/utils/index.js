function parseQuery(query) {
    if (!query) {
        return '';
    }

    return query.replace(/\?/g, '').split('&');
}

export {
    parseQuery
};