
const router = require('express').Router();
const { jsonResponse } = require('../lib/jsonResponse');
const Login = require('../models/login');
const { getTokenHeader } = require('../auth/getTokenHeader');
const Relation = require('../models/relation');
const Device = require('../models/device');
const session = require('express-session');



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

            req.session.email = email;
        
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
            
            res.status(200).json(jsonResponse(200, {
                message: 'User created successfully',
            }));
        }  
    } catch (error) {
        
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
            const token = await Token.findOne({ where: { token } });
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

router.post('/patient', async (req, res) => {
    const { name, lastName, emailP, password, deviceId } = req.body;
    const { email } = req.session;

    if (!name || !lastName || !emailP || !password || !deviceId) {
        return res.status(400).json(jsonResponse(400, {
            error: 'All fields are required',
        }));
    }

    try {
        
        const relation = new Relation();
        const emailExists = await relation.emailExists(emailP);

        if (emailExists) {
            return res.status(400).json(jsonResponse(400, {
                error: 'Email already exists',
            }));
        }

        const deviceExists = await relation.deviceExists(deviceId);
        if (deviceExists) {
            return res.status(400).json(jsonResponse(400, {
                error: 'Device already exists',
            }));

        } else {
            const relation = new Relation({ deviceId, emailD: email, emailP });
            await relation.save();

            const login = new Login({ name, lastName, email: emailP, password });
            await login.save();
            
            const device = new Device();
            await Device.update(
                { Status: true, 
                  Name: `${name} ${lastName}`  
                }, 
                { where: { DeviceId: deviceId } } 
            );

            res.status(200).json(jsonResponse(200, {
                message: 'User patient created successfully',
            }));
        }  
    } catch (error) {
        
        res.status(500).json(jsonResponse(500, {
            error: 'Error saving user to the database',
        }));
    }
});

router.post('/bracelet', async (req, res) => {
    const { deviceId } = req.body;

    if (!deviceId) {
        return res.status(400).json(jsonResponse(400, {
            error: 'All fields are required',
        }));
    }

    try {
        // Update Device table
        await Device.update(
            { Status: false, 
              Name: 'Brazalete sin asignar'  
            },
            { where: { DeviceId: deviceId } }
        );

        // Delete a row in the Relation table where the column deviceId matches the provided deviceId
        const relationRow = await Relation.findOne({ where: { deviceId: deviceId } });

        if (relationRow) {
            // Retrieve emailP from the Relation table
            const { emailP } = relationRow;

            // Delete the row in the Relation table
            await Relation.destroy({ where: { deviceId: deviceId } });

            // Delete the row in the Login table where email matches emailP
            await Login.destroy({ where: { email: emailP } });

            res.status(200).json(jsonResponse(200, {
                message: 'Bracelet released and associated data removed successfully',
            }));
        } else {
            res.status(404).json(jsonResponse(404, {
                error: 'No relation found with the provided deviceId',
            }));
        }
    } catch (error) {
        res.status(500).json(jsonResponse(500, {
            error: 'Error releasing bracelet or associated data from the database',
        }));
    }
});

module.exports = router;