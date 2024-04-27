const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config();
const authenticate = require('./auth/authenticate');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');

const sequelize = require('./dbServer');
const authRoutes = require('./routers/authRoutes');
const apiRoutes = require('./routers/apiRoutes');
const refreshToken = require('./routers/refreshToken');
const user = require('./routers/user');


const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors());
app.use(bodyParser.json());
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false },
}));

app.use('/api', apiRoutes);


app.use('/token', refreshToken);
app.use('/auth', authRoutes);

app.use('/api', authenticate, user);

const root = require('path').join(__dirname, '../webfront/build');
app.use(express.static(root));

app.use('/*', (req, res) => {
  res.sendFile(path.join(__dirname, '../webfront/build', 'index.html'));
});

const port = process.env.PORT || 80;

sequelize.sync()
  .then(() => {
    console.log('Models synced successfully');
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch((error) => {
    console.error('Error syncing models:', error);
  });




