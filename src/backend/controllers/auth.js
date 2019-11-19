const jwt = require('jsonwebtoken');

exports.createJWT = (githubToken) => {
    return jwt.sign({
        githubToken: githubToken
    }, process.env.JWT_SECRET, {
        expiresIn: '12h'
    });
}

exports.decodeJWT = (token) => {
    try {
        return Promise.resolve(jwt.verify(token, process.env.JWT_SECRET));
    } catch (err) {
        return Promise.reject(new Error('Invalid token'));
    }
}
