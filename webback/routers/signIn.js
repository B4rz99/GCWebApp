const router = require('express').Router();
const { jsonResponse } = require('../lib/jsonResponse');
const Login = require('../models/login');
const { getEmailInfo } = require('../lib/getEmailInfo');

router.post('/signIn', async (req, res) => {
    const {email, password} = req.body;

    if (!email || !password) {
        return res.status(400).json(jsonResponse(400, {
            error: 'All fields are required'
        }));
    }

    const login = await Login.findOne({ where: { email } });

    if (!login) {
        return res.status(400).json(jsonResponse(400, {
            error: 'Wrong credentials'
        }));
    } else {
        const isValidPassword = await login.isValidPassword(password);
        if (!isValidPassword) {
            return res.status(400).json(jsonResponse(400, {
                error: 'User or password is incorrect'
            }));
        } else {
            const accessToken = login.createAccessToken();
            const refreshToken  = await login.createRefreshToken();
        
            res.status(200).json(jsonResponse(200, {
                accessToken,
                refreshToken,
                email,
                }));
        
            }
    }
});

module.exports = router;