const { rateLimit } = require('express-rate-limit');

//for each ip address they can send 50 requests to this server for every five minutes
const limiter = rateLimit({
    windowMs: 5 * 60 * 1000,
    limit: 50,
    message: "Too many requests, try again in five minutes",
    standardHeaders: 'draft-7', 
	legacyHeaders: false
});

//for each ip address they can send 100 requests to this server for every five minutes
const postLimiter = rateLimit({
    windowMs: 5 * 60 * 1000,
    limit: 100,
    message: "Too many requests, try again in five minutes",
    standardHeaders: 'draft-7',
	legacyHeaders: false
});

module.exports = {
    postLimiter,
    limiter
}