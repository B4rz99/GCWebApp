const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config();
const path = require('path');

const sequelize = require('./dbServer');
const authRoutes = require('./routers/authRoutes');
const apiRoutes = require('./routers/apiRoutes');
const webRoutes = require('./routers/webRoutes');
const refreshToken = require('./routers/refreshToken');
const signIn = require('./routers/signIn');
const signUp = require('./routers/signUp');
const signOut = require('./routers/signOut');
const user = require('./routers/user');
const todos = require('./routers/todos');


const app = express();
const buildPath = path.join(__dirname, '/../webfront/build');

app.use(express.static(buildPath));
app.use(express.json());
app.use(cookieParser());
app.use(cors());

app.use('/api', apiRoutes);

/*app.use('/auth', authRoutes);*/

app.use('/api', refreshToken);
app.use('/api', signIn);
app.use('/api', signUp);
app.use('/api', signOut);
app.use('/api', user);
app.use('/api', todos);



app.use('/', webRoutes);
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




