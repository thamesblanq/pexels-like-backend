const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const usersDB = {
    users: require('../models/users.json'),
    setUsers: function (data) { this.users = data }
} // Load user data from a file or database

dotenv.config();

const handleRefreshToken = async (req, res) => {
    try {
        const cookies = req.cookies;
        if (!cookies?.jwt) {
            return res.status(401).json({ "message": 'Unauthorized' });
        }

        const refreshToken = cookies.jwt;
        const foundUser = usersDB.users.find((user) => user.refreshToken === refreshToken);

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

                const accessToken = jwt.sign(
                    { username: decoded.username },
                    process.env.ACCESS_TOKEN,
                    { expiresIn: '10min' }
                );
                res.json({ accessToken });
            }
        );
    } catch (error) {
        console.error(error);
        res.status(500).json({ "message": 'Internal Server Error' });
    }
};

module.exports = { handleRefreshToken };