const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config();
const authenticate = require('./auth/authenticate');

const sequelize = require('./dbServer');
const authRoutes = require('./routers/authRoutes');
const apiRoutes = require('./routers/apiRoutes');
const refreshToken = require('./routers/refreshToken');
const user = require('./routers/user');


const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors());

app.use('/api', apiRoutes);


app.use('/token', refreshToken);
app.use('/auth', authRoutes);

app.use('/api', authenticate, user);

const port = process.env.PORT || 3001;

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




