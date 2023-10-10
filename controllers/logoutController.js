const usersDB = {
    users: require('../models/users.json'),
    setUsers: function (data) { this.users = data }
} // Load user data from a file or database
const fsPromises = require('fs').promises;
const path = require('path');

const handleLogout = async (req, res) => {
    try {
        //remove refreshToken from frontend

        const cookies = req.cookies;
        if (!cookies?.jwt) {
            return res.status(204).json({ "message": 'No content' });
        }

        //check for refreshToken in db
        const refreshToken = cookies.jwt;
        const foundUser = usersDB.users.find((user) => user.refreshToken === refreshToken);
        if (!foundUser) {
            res.clearCookie('jwt', { httpOnly: true, secure: true, sameSite: 'None', maxAge: 24 * 60 * 60 * 1000 })
            return res.status(204).json({ "message": 'No content' });
        }

        //delete refreshToken from db
        const otherUsers = usersDB.users.filter(user => user.refreshToken !== foundUser.refreshToken);
        const currentUser = {...foundUser, refreshToken: ""};
        usersDB.setUsers([...otherUsers, currentUser]);
        //save changes
        await fsPromises.writeFile(
            path.join(__dirname, '..', 'models', 'users.json'),
            JSON.stringify(usersDB.users)
        );
        //clear refreshToken cookie
        res.clearCookie('jwt', { httpOnly: true, secure: true, sameSite: 'None', maxAge: 24 * 60 * 60 * 1000 });
        return res.status(204).json({ "message": 'No content' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ "message": 'Internal Server Error' });
    }
};

module.exports = { handleLogout };