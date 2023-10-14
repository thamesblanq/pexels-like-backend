const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const User = require('../models/User') // Load user data from a file or database

dotenv.config();

const handleRefreshToken = async (req, res) => {
    try {
        const cookies = req.cookies;
        if (!cookies?.jwt) {
            return res.status(401).json({ "message": 'Unauthorized' });
        }

        const refreshToken = cookies.jwt;
        const foundUser = await User.findOne({ refreshToken }).exec();

        if (!foundUser) {
            return res.status(403).json({ "message": 'Forbidden' });
        }

        jwt.verify(
            refreshToken,
            process.env.REFRESH_TOKEN,
            (err, decoded) => {
                if (err || foundUser.username !== decoded.username) {
                    return res.status(403).json({ "message": 'Forbidden' });
                }
                const roles = Object.values(foundUser.roles);
                const accessToken = jwt.sign(
                    { 
                        "UserInfo": {
                            "username": foundUser.username,
                            "roles": roles
                    }},
                    process.env.ACCESS_TOKEN,
                    { expiresIn: '10min' }
                );
                res.json({ roles, accessToken });
            }
        );
    } catch (error) {
        console.error(error);
        res.status(500).json({ "message": "Internal Server Error" });
    }
};

module.exports = { handleRefreshToken };