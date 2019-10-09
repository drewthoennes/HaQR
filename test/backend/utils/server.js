require('module-alias/register');
const express = require('express');
const bodyParser = require('body-parser');

let app;
let session;

const createApp = () => {
    app = express();

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended: false}));

    app.use(function(err, req, res, next) {
        if (err instanceof SyntaxError) {
            res.json({'error': 'Invalid JSON'});
        }
        else {
            next();
        }
    });

    app.use(require('@/src/backend/routes')());

    return app;
}

const createSession = () => {
    if (app) {
        session = app.listen(42014);
    }
}

const getApp = () => {
    if (!app) {
        return createApp();
    }

    return app;
}

const getNewApp = () => {
    killSession();
    createApp();
    createSession();

    return app;
}

const killSession = () => {
    if (session) {
        return session.close();
    }

    return;
}

module.exports = {
    getApp,
    getNewApp,
    killSession
}
