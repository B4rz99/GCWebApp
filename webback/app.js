const express = require('express');
const cors = require('cors');
const app = express();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const cookieParser = require('cookie-parser');
const path = require('path');

const sequelize = require('./dbServer');
const Device = require('./models/device');
const HeartRate = require('./models/heartRate');
const Login = require('./models/login');
const Oxygen = require('./models/oxygen');
const Position = require('./models/position');
const Temperature = require('./models/temperature');

Device.hasMany(Position, {foreignKey: 'DeviceId' });
Device.hasMany(HeartRate, {foreignKey: 'DeviceId' });
Device.hasMany(Temperature, {foreignKey: 'DeviceId' });
Device.hasMany(Oxygen, {foreignKey: 'DeviceId' });

Position.belongsTo(Device, {foreignKey: 'DeviceId'});
HeartRate.belongsTo(Device, {foreignKey: 'DeviceId'});
Temperature.belongsTo(Device, {foreignKey: 'DeviceId'});
Oxygen.belongsTo(Device, {foreignKey: 'DeviceId'});

sequelize.sync()
	.then(() =>{
		console.log('Models synced successfully');
	})
	.catch((error) =>{
		console.error('Error syncing models:', error);
	});


const buildPath = path.join(__dirname, '/../webfront/build');
require('dotenv').config();
app.use(express.static(buildPath))
//app.use(cors({
//    origin: ['http://localhost:3000'],
//    methods: ['GET', 'POST'],
//    credentials: true
//}));
app.use(express.json());
app.use(cookieParser());

app.get('/*', (req, res) => {

  res.sendFile(path.join(buildPath, 'index.html'));
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

      // // Use bcrypt to compare the provided password with the hashed password stored in the database
      // bcrypt.compare(password, user.password, (err, response) => {
      //     if (err) {  
      //         return res.json({ message: 'Password compare error' });
      //     }
      //     if (response) {
      //         // If password matches, generate a JWT token for authentication
      //         const token = jwt.sign({ name: user.name }, 'jwt-secret-key', { expiresIn: '1d' });
      //         console.log(user);
      //         // Set the token as a cookie in the response
      //         res.cookie('token', token);
      //         return res.json({ message: 'User logged in' });
      //     } else {
      //         return res.json({ message: 'Wrong password' });
      //     }
      // });
      // Use bcrypt to compare the provided password with the hashed password stored in the database
      const passwordMatch = bcrypt.compareSync(password, user.password);

      if (passwordMatch) {
          // If password matches, generate a JWT token for authentication
          const token = jwt.sign({ name: user.name }, 'jwt-secret-key', { expiresIn: '1d' });

          // Set the token as a cookie in the response
          res.cookie('token', token);

          return res.json({ message: 'User logged in' });
      } else {
          return res.json({ message: 'Wrong password' });
      }
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
  }
};

app.get('/home',verifyUser, (req, res) => {
  return res.json({ message: 'User logged in', name: req.name });
  });

app.get('/api/logout', (req, res) => {
  res.clearCookie('token');
  return res.json({ message: 'User logged out' });
  });

const port = process.env.PORT || 3001;


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});


