const User = require('../models/User');
const bcrypt = require('bcrypt');

//get All Users
const getAllUsers = async (req, res) => {
    try{
        const users = await User.find();
        if (!users) return res.status(204).json({ "message": "No users found" })
        res.json(users)
    } catch (err) {
        console.log(err.message);
        res.status(500).json({ "message": "Internal server error" });
    }
     
} 

//update an existing user
const updateUser =  async (req, res) => {
    try{
        //check for req.body
        if(!req?.body) return res.status(400).json({ "message": `A request body is needed.` });
        //find user
        const foundUser = await User.findOne({ username: req.body.username }).exec();
        //user check
        if(!foundUser) return res.status(401).json({ "message": `User with username ${req.body.username} was not found` });
        //password check
        let newPwd;
        if(req.body?.password) {
            try{
                newPwd = await bcrypt.hash(req.body.password, 10);
            } catch(err) {
                res.status(500).json({ "message": err.message })
            }
        } else{
            newPwd = foundUser.password;
        }
        //add changes
        if (req.body?.name) foundUser.name = req.body.name;
        if (req.body?.username) foundUser.username = req.body.username;
        const result = await foundUser.save();
        res.status(200).json({ "message": "Success" });
    } catch(err) {
        console.log(err.message);
        res.status(500).json({ "message": "Internal server error" })
    }

}

//delete an existing user
const deleteUser = async (req, res) => {
    if (!req?.body?.username) return res.status(400).json({ 'message': 'Username required.' });
    try{
        //find user
        const foundUser = await User.findOne({ username: req.body.username }).exec();
        if(!foundUser) return res.status(401).json({ "message": `User with username ${req.body.username} was not found` });
        const result = await foundUser.deleteOne();
        res.status(200).json({ "message": `User with username ${req.body.username} has been deleted` });
    } catch (err) {
        console.log(err.message);
        res.status(500).json({ "message": "Internal server error" });
    }

}

//get a particular user by username
const getUser = async (req, res) => {
    if (!req?.params?.username) return res.status(400).json({ 'message': 'Username required.' });
    try {
        const user = await User.findOne({ username: req.params.username }).exec();
        if (!user) {
            return res.status(404).json({ "message": `User with username ${req.params.username} was not found` });
        }
        res.json(user);
        console.log(user);
    } catch (err) {
        console.log(err.message);
        res.status(500).json({ "message": "Internal server error" });
    }
}


module.exports = {
    getAllUsers,
    updateUser,
    deleteUser,
    getUser
}