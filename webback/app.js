const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config();
const path = require('path');

const sequelize = require('./dbServer');
const authRoutes = require('./routers/authRoutes');
const apiRoutes = require('./routers/apiRoutes');
const webRoutes = require('./routers/webRoutes');


const app = express();
const buildPath = path.join(__dirname, '/../webfront/build');



//app.use(cors({
//    origin: ['http://localhost:3000'],
//    methods: ['GET', 'POST'],
//    credentials: true
//}));
app.use(express.static(buildPath));
app.use(express.json());
app.use(cookieParser());

app.use('/api', apiRoutes);

app.use('/auth', authRoutes);

app.use('/', webRoutes);
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




