const express = require('express');
const app = express();
const connectOfDB = require('./config/db');
const { logger } = require('./middleware/logger');
const { notFound, errorHandler } = require('./middleware/errors');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');

// .env file
require('dotenv').config();

// Connect to DB
connectOfDB();

// Static folder
app.use(express.static(path.join(__dirname,'images')));

//Middleware
app.use(express.json());//body parser

app.use(express.urlencoded({ extended: false }));//body parser

app.use(logger);//logger middleware

// helmet
app.use(helmet());// helmet middleware to secure the app

// cors
app.use(cors({
    origin : "*"
}));// cors middleware to allow all origins

// View engine
app.set('view engine', 'ejs');

// routes
app.use('/api/auth', require('./routes/auth'));//auth routes
app.use('/api/users', require('./routes/users'));//user routes
app.use('/password', require('./routes/password'));//password routes
app.use('/api/producer', require('./routes/producers'));//estate routes
app.use('/api/feedback', require('./routes/feedback'));//feedback routes
app.use('/api/sendContact',require('./routes/contactUs'));//Coutact Us routes



// Error handler Middleware
app.use(notFound);
app.use(errorHandler);

// Runing the server
const port = process.env.PORT ;
app.listen(port , () => {
    console.log(`Server is running in ${process.env.MODE_ENV} on port ${port}`);
});

