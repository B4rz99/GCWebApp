const express = require('express');
const cors = require('cors');
const Sequelize = require('sequelize');
const app = express();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const cookieParser = require('cookie-parser');
const config = require('./config.json');
const { DataTypes } = require('sequelize');



require('dotenv').config();

app.use(cors({
    origin: ['http://localhost:3000'],
    methods: ['GET', 'POST'],
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());

const sequelize = new Sequelize(config.database, config.username, config.password, {
	logging: false,
	host: config.host,
	dialect: config.dialect,
	port: config.port,
	dialectOptions: {
		ssl: {
			require: true,
			rejectUnauthorized: false
		}
	}
});

const Login = sequelize.define('Login', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false
    },
    password: {
      type: DataTypes.STRING(60),
      allowNull: false
    }
  });
  

  app.post('/api/signUp', async (req, res) => {
    try {
      // Hash the password before storing it
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
  
      // Create a new login record in the database using Sequelize
      const newLogin = await Login.create({
        name: req.body.name,
        lastName: req.body.lastName,
        email: req.body.email,
        password: hashedPassword // Store the hashed password
      });
  
      res.status(201).json({ message: 'User created' });
    } catch (error) {
      console.error('Error creating login:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  app.post('/api/signIn', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find the user by email using Sequelize's findOne method
        const user = await Login.findOne({ where: { email } });

        if (!user) {
            return res.json({ message: 'Email not found' });
        }

        // Use bcrypt to compare the provided password with the hashed password stored in the database
        bcrypt.compare(password, user.password, (err, response) => {
            if (err) {
                return res.json({ message: 'Password compare error' });
            }
            if (response) {
                // If password matches, generate a JWT token for authentication
                const token = jwt.sign({ name: user.name }, 'jwt-secret-key', { expiresIn: '1d' });
                console.log(user);
                // Set the token as a cookie in the response
                res.cookie('token', token);
                return res.json({ message: 'User logged in' });
            } else {
                return res.json({ message: 'Wrong password' });
            }
        });
    } catch (error) {
        console.error('Error signing in:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});

  const verifyUser = (req, res, next) => {
    const token = req.cookies.token;
    if(!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    } else {
        jwt.verify(token, 'jwt-secret-key', (err, decoded) => {
            if(err) {
                return res.status(401).json({ message: 'Token unvalid' });
            } else {
                req.name = decoded.name;
                next();
            }
        });
    }};

  app.get('/home',verifyUser, (req, res) => {
    return res.json({ message: 'User logged in', name: req.name });
    });

  app.get('/api/logout', (req, res) => {
    res.clearCookie('token');
    return res.json({ message: 'User logged out' });
    });

const port = process.env.PORT || 3001;

app.get('/', (req, res) => {
    res.send('Hello World');
});

app.listen(port, () => {
    console.log(`Server is running on port ${config.port}`);
});



module.exports = { sequelize };