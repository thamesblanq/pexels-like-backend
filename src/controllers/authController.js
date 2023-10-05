const usersDB = {
    users: require('../models/users.json'),
    setUsers: function (data) { this.users = data }
}

const bcrypt = require('bcrypt');

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
    res.status(200).json({ "message": `User ${user} is logged in.` })
   } else {
    res.status(401).json({ "message": "Wrong password" })//Unauthorized
   }


}

module.exports = { handleLogin }