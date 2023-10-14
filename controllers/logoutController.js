const User = require('../models/User'); // Load user data from a file or database

const handleLogout = async (req, res) => {
    try {
        //remove refreshToken from frontend

        const cookies = req.cookies;
        if (!cookies?.jwt) {
            return res.status(204).json({ "message": 'No content' });
        }

        //check for refreshToken in db
        const refreshToken = cookies.jwt;
        const foundUser = await User.findOne({ refreshToken });
        if (!foundUser) {
            res.clearCookie('jwt', { httpOnly: true, secure: true, sameSite: 'None', maxAge: 24 * 60 * 60 * 1000 })
            return res.status(204).json({ "message": 'No content' });
        }

        //delete refreshToken from db
        foundUser.refreshToken = "";
        const result = await foundUser.save();
        //console.log(result);
       
        //clear refreshToken cookie
        res.clearCookie('jwt', { httpOnly: true, secure: true, sameSite: 'None', maxAge: 24 * 60 * 60 * 1000 });
        return res.status(204).json({ "message": 'No content' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ "message": 'Internal Server Error' });
    }
};

module.exports = { handleLogout };