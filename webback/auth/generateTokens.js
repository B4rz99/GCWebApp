const jwt = require('jsonwebtoken');

function sign(payload, isAccessToken) {
    return jwt.sign(payload, isAccessToken? process.env.ACCESS_TOKEN_SECRET : process.env.REFRESH_TOKEN_SECRET, { algorithm: 'HS256', expiresIn: '3600'});
}

function generateAccessToken(email) {
    return sign({ email }, true);
}

function generateRefreshToken(email) {
    return sign({ email }, false);
}

module.exports = { generateAccessToken, generateRefreshToken };