const usersDB = {
    users: require('../models/users.json'),
    setUsers: function (data) { this.users = data }
}
const { v4: uuidv4 } = require('uuid');
const fsPromises = require('fs').promises;
const path = require('path');

const bcrypt = require('bcrypt');

const handleNewUser = async (req, res) => {
    //destructure username and password from request body
    const { username, pwd, name } = req.body;
    //check if there's no user
    if(!username || !pwd || !name ) return res.status(400).json({ "message": "Please fill all input fields" })// 400 for bad requests
    //check for duplicate
    const duplicate = usersDB.users.find(person => person.username === username);
    if(duplicate) return res.status(409).json({ "message": `Username ${username} already exist.` })// duplicate
    //encrypt password
    try{
        const hashedPwd = await bcrypt.hash(pwd, 10);
        //save user data
        const newUser = {
            "id": uuidv4(),
            "name": name,
            "username": username,
            "roles": { "User": 1000 },
            "password": hashedPwd
        }
        //reset usersDB data
        usersDB.setUsers([...usersDB.users, newUser]);
        await fsPromises.writeFile(
            path.join(__dirname, '..', 'models', 'users.json'),
            JSON.stringify(usersDB.users)
        );
        console.log(usersDB.users);
        //send back message
        res.status(201).json({ 'success': `New user ${user} created!` });

    } catch(err){
        res.status(500).json({ "message": err.message })//internal server error
        console.log(err.stack)
    }



}

module.exports = { handleNewUser }