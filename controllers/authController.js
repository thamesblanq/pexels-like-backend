const usersDB = {
    users: require('../models/users.json'),
    setUsers: function (data) { this.users = data }
}

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const fsPromises = require('fs').promises;
const path = require('path');

const handleLogin = async (req, res) => {
    //destructure username and password from request body
    const { user, pwd } = req.body;
    //check if there's no user
    if(!user || !pwd) return res.status(400).json({ "message": "Please input your username or password" })// 400 fr bad requests
    //find user
    const foundUser = usersDB.users.find(person => person.username === user);
    //no user found?
    if(!foundUser) return res.status(401).json({ "message": `User with username ${user} not found`})//unauthorized
    //if user is found, evaluate user's pwd
    const match = await bcrypt.compare(pwd, foundUser.password)
    //check for match
   if (match) {
    //create JWTs
    
        const accessToken = jwt.sign(
            { "username": foundUser.username },
            process.env.ACCESS_TOKEN,
            { expiresIn: '10min' }
        )
        const refreshToken = jwt.sign(
            { "username": foundUser.username },
            process.env.REFRESH_TOKEN,
            { expiresIn: '1d' }
        )
        //save refreshToken with user
        const currentUser = { ...foundUser, refreshToken };
        const otherUsers = usersDB.users.filter(user => user.id !== currentUser.id);
        usersDB.setUsers([...otherUsers, currentUser])
        await fsPromises.writeFile(
            path.join(__dirname, '..', 'models', 'users.json'),
            JSON.stringify(usersDB.users)
        );
        res.cookie("jwt", refreshToken, { httpOnly: true, secure: true, sameSite: 'None', maxAge: 24 * 60 * 60 * 1000 })
        res.json({ accessToken });

   } else {
    res.sendStatus(401)//Unauthorized
   }


}

module.exports = { handleLogin }