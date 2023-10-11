const fs = require('fs');
const path = require('path');
const morgan = require('morgan');
const express = require('express');

// Log directory path and check if directory exists if not create a new one
const logDirectory = path.resolve(__dirname, '..', 'log');
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);

//custom filename with date
const getLogFilePath = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return path.join(logDirectory, `access_${year}-${month}-${day}.log`);
};

// Create a writable stream
const logStream = fs.createWriteStream(getLogFilePath(), { flags: 'a' });

module.exports = {
    dev: morgan('dev'),
    combined: morgan('combined', { stream: logStream })
};
