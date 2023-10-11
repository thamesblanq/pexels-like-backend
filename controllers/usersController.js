const usersDB = {
    users: require('../models/users.json'),
    setUsers: function (data) { this.users = data }
};
const bcrypt = require('bcrypt');

//get All Users
const getAllUsers = (req, res) => {
    try{
        res.json(usersDB.users )
    } catch (err) {
        console.log(err.message);
        res.status(500).json({ "message": "Internal server error" });
    }
     
} 

//update an existing user
const updateUser =  async (req, res) => {
    try{
        //find user
        const foundUser = usersDB.users.find(user => user.id === req.body.id);
        //user check
        if(!foundUser) return res.status(401).json({ "message": `User ID not found` });
        //password check
        let newPwd;
        if(req.body.password) {
            try{
                newPwd = await bcrypt.hash(req.body.password, 10);
            } catch(err) {
                res.status(500).json({ "message": err.message })
            }
        } else{
            newPwd = foundUser.password;
        }
        //add changes
        if (req.body.name) foundUser.name = req.body.name;
        if (req.body.username) foundUser.username = req.body.username;
        if(req.body.password) foundUser.password = newPwd;
        usersDB.setUsers(foundUser);
        res.json(usersDB.users);
    } catch(err) {
        console.log(err.message);
        res.status(500).json({ "message": "Internal server error" })
    }

}

//delete an existing user
const deleteUser = (req, res) => {
    try{
        //find user
        const foundUser = usersDB.users.find(user => user.id === req.body.id);
        //user check
        if(!foundUser) return res.status(401).json({ "message": `User not found` });
        const updatedUsers = usersDB.users.filter(person => person.id !== req.body.id);
        usersDB.setUsers(updatedUsers);
        res.status(200).json({ "message": `User with ID ${req.body.id} has been deleted` });
    } catch (err) {
        console.log(err.message);
        res.status(500).json({ "message": "Internal server error" });
    }

}

//get a particular user by id
const getUser = (req, res) => {
    try{
        const user = usersDB.users.find(person => person.id === req.params.id);
        if (!user) {
            return res.status(400).json({ "message": `User not found` });
        }
        res.json(user);
    }catch(err){
        console.log(err.message);
        res.status(500).json({ "message": "Internal server error" })
    }

}

module.exports = {
    getAllUsers,
    updateUser,
    deleteUser,
    getUser
}