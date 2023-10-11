require('dotenv').config();
const jwt = require('jsonwebtoken');

const verifyJWT = (req, res, next) => {
    const authHeader = req.headers['authorization'] || req.headers.authorization || req.headers.Authorization;
    if(!authHeader?.startsWith('Bearer ')) return res.status(401).json({ "message": "Unauthorized" });//unauthorized
    //console.log(authHeader);
    const token = authHeader.split(" ")[1];
    jwt.verify(
        token,
        process.env.ACCESS_TOKEN,
        (err, decoded) => {
            if(err) return res.sendStatus(403);//forbidden-- accessToken could have been manipulated
            req.user = decoded.UserInfo.username;
            req.roles = decoded.UserInfo.roles;
            next();
        }
    );
}

module.exports = verifyJWT;