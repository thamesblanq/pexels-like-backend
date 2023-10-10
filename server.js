// Patches
const {inject, errorHandler} = require('express-custom-error');
inject(); // Patch express in order to use async / await syntax

// Require Dependencies
require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const connectDB = require('./config/dbConn');
const logger = require('./util/logger');
const PORT  = process.env.PORT;
const app = express();

//connect to DB
//connectDB();


// Configure Express App Instance
app.use(express.json());
app.use(express.urlencoded());

// Configure custom logger middleware
app.use(logger.dev, logger.combined);
app.use(cookieParser());
app.use(cors());

// This middleware adds the json header to every response
app.use('*', (req, res, next) => {
    res.setHeader('Content-Type', 'application/json');
    next();
})

//ROUTES
app.use('/register', require('./routes/register'));
app.use('/auth', require('./routes/auth'));
app.use('/refresh', require('./routes/refresh'));
app.use('/logout', require('./routes/logout'));
//protected routes-- add security here
app.use('/user', require('./routes/api/user'));
app.use('/post', require('./routes/api/post'));


// 404 route
app.use('*', (req, res) => {
    res
    .status(404)
    .json( {status: false, message: 'Endpoint Not Found'} );
})

// Handle errors
app.use(errorHandler());

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));

/* mongoose.connection.once('open', () => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}); */