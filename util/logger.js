const morgan = require('morgan');
const fs = require('fs');
const path = require('path');

// Log directory path
const logDirectory = path.resolve(__dirname, '..', 'log');

// Ensure log directory exists
if (!fs.existsSync(logDirectory)) {
    fs.mkdirSync(logDirectory);
}

// Log file path
const logFilePath = path.join(logDirectory, 'access.log');

// Create a writable stream
const logStream = fs.createWriteStream(logFilePath, { flags: 'a' });

module.exports = {
    dev: morgan('dev'),
    combined: morgan('combined', { stream: logStream })
};
