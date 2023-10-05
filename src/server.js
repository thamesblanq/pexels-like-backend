// Patches
const {inject, errorHandler} = require('express-custom-error');
inject(); // Patch express in order to use async / await syntax

// Require Dependencies

const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const helmet = require('helmet');


const logger = require('./util/logger');

// Load .env Enviroment Variables to process.env
require('dotenv').config();

const  PORT  = process.env.PORT;


// Instantiate an Express Application
const app = express();


// Configure Express App Instance
app.use(express.json());
app.use(express.urlencoded());

// Configure custom logger middleware
app.use(logger.dev, logger.combined);

app.use(cookieParser());
app.use(cors());
app.use(helmet());

// This middleware adds the json header to every response
app.use('*', (req, res, next) => {
    res.setHeader('Content-Type', 'application/json');
    next();
})

//Routes
//register route
app.use('/register', require('./routes/register.js'));
//authorization route
app.use('/auth', require('./routes/auth'));


// 404 route
app.use('*', (req, res) => {
    res
    .status(404)
    .json( {status: false, message: 'Endpoint Not Found'} );
})

// Handle errors
app.use(errorHandler());

// Open Server on selected Port
app.listen(
    PORT,
    () => console.log(`Server listening on port ${PORT}`)
);