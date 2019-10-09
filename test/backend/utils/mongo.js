const MongoMemoryServer = require('mongodb-memory-server').MongoMemoryServer;
const mongoose = require('mongoose');

let mongoServer;

exports.beforeEach = () => {
    mongoServer = new MongoMemoryServer();
    return mongoServer.getConnectionString().then(uri => {
        return mongoose.connect(uri, {
            useCreateIndex: true,
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
    });
};

exports.afterEach = () => {
    return mongoose.disconnect().then(() => {
        return mongoServer.stop();
    });
};
