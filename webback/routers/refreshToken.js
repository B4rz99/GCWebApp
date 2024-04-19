const router = require('express').Router();
const { getTokenHeader } = require('../auth/getTokenHeader');
const Token = require('../models/token');
const { verifyRefreshToken } = require('../auth/verifyToken');

router.post('/refreshToken', async (req, res) => {
    const refreshToken = getTokenHeader(req.headers);

    if (!refreshToken) {
        return res.status(401).send(jsonResponse(401, {error : 'Unauthorized'}));
    } else {
        try {
            const found = await Token.findOne({ where: { token: refreshToken } });
            if (!found) {
                return res.status(401).send(jsonResponse(401, {error : 'Unauthorized'}));
            }
            
            const payload = verifyRefreshToken(found.token);

            if (!payload) {
                return res.status(401).send(jsonResponse(401, {error : 'Unauthorized'}));
            } else {
                const accessToken = generateAccessToken(payload.email);
                return res.tatus(200).send(jsonResponse(200, {accessToken}));
            }
        } catch (error) {
            return res.status(500).send(jsonResponse(500, {error : 'Internal server error'}));
        }
    }
});

module.exports = router;