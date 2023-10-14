const User = require('../models/User');
const bcrypt = require('bcrypt');

const handleNewUser = async (req, res) => {
    //destructure username and password from request body
    const { username, pwd, name } = req.body;
    //check if there's no user
    if(!username || !pwd || !name ) return res.status(400).json({ "message": `Username, password and name are required` })// 400 for bad requests
    //check for duplicate
    const duplicate = await User.findOne({ username: username }).exec();
    if(duplicate) return res.status(409).json({ "message": `Username ${username} already exist.` })// duplicate
   //check for username being up to 36 characters and halt action......also check on the frontend too
    if(username.length === 36) return res.status(400).json({ "message": "Username can't be 36 characters" });
     //encrypt password
    try{
        const hashedPwd = await bcrypt.hash(pwd, 10);
        //save user data
        const result = await User.create({
            "name": name,
            "username": username,
            "password": hashedPwd
        });
        //console.log(result);
        //send back message
        res.status(201).json({ 'success': `New user ${username} created!` });

    } catch(err){
        res.status(500).json({ "message": err.message })//internal server error
        console.log(err.stack)
    }



}

module.exports = { handleNewUser }