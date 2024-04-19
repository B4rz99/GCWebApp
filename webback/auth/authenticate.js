const getTokenHeader = require('./getTokenHeader');
const { verifyAccessToken } = require('./verifyToken');
const { jsonResponse } = require('../lib/jsonResponse');

function authenticate(req, res, next) {
  const token = getTokenHeader(req.headers);

  if (!token) {
    return res.status(401).send({
      error: 'Unauthorized'
    });
  } else {
    const decoded = verifyAccessToken(token);
    if (decoded) {
        req.email = { ...decoded.email };
        next();
    } else {
        return res.status(401).send(jsonResponse(401, {error : 'Unauthorized'}));
    }
}
}

module.exports = authenticate;