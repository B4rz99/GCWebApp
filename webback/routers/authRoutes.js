
const router = require('express').Router();
const { jsonResponse } = require('../lib/jsonResponse');
const Login = require('../models/login');
const { getTokenHeader } = require('../lib/getTokenHeader');



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

router.post('/signUp', async (req, res) => {
    const { name, lastName, email, password } = req.body;

    if (!name || !lastName || !email || !password) {
        return res.status(400).json(jsonResponse(400, {
            error: 'All fields are required',
        }));
    }

    try {
        // Create a new instance of Login with the provided data
        const login = new Login();
        const emailExists = await login.emailExists(email);

        if (emailExists) {
            return res.status(400).json(jsonResponse(400, {
                error: 'Email already exists',
            }));
        } else {
            const login = new Login({ name, lastName, email, password });
            // Use await to save the login instance to the database
            await login.save();
            // Respond with a success message
            res.status(200).json(jsonResponse(200, {
                message: 'User created successfully',
            }));
        }  
    } catch (error) {
        // Handle any errors that occur during the save operation
        res.status(500).json(jsonResponse(500, {
            error: 'Error saving user to the database',
        }));
    }
});

router.delete('/signOut', async (req, res) => {
    try {
        const refreshToken = getTokenHeader(req.headers);
        if (!refreshToken) {
            return res.status(401).json({
                status: 401,
                data: { error: 'Unauthorized' },
            });
        } else {
            // Find the token in the database and delete it
            const token = await Token.findOne({ where: { refreshToken } });
            if (token) {
                await token.destroy();
                return res.status(200).json({
                    status: 200,
                    data: { message: 'User logged out successfully' },
                });
            } else {
                return res.status(404).json({
                    status: 404,
                    data: { error: 'Token not found' },
                });
            }
        }
    } catch (error) {
        return res.status(500).json({
            status: 500,
            data: { error: 'Internal server error' },
        });
    }
});

router.post('/profile', async (req, res) => {
    const { name, lastName, email, deviceId } = req.body;

    if (!name || !lastName || !email || !deviceId) {
        return res.status(400).json(jsonResponse(400, {
            error: 'All fields are required',
        }));
    }

    try {
        // Create a new instance of Login with the provided data
        const login = new Login();
        const emailExists = await login.emailExists(email);

        if (emailExists) {
            return res.status(400).json(jsonResponse(400, {
                error: 'Email already exists',
            }));
        } else {
            const login = new Login({ name, lastName, email, deviceId });
            // Use await to save the login instance to the database
            await login.save();
            // Respond with a success message
            res.status(200).json(jsonResponse(200, {
                message: 'User created successfully',
            }));
        }  
    } catch (error) {
        // Handle any errors that occur during the save operation
        res.status(500).json(jsonResponse(500, {
            error: 'Error saving user to the database',
        }));
    }
});

module.exports = router;