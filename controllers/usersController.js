const usersDB = {
    users: require('../models/users.json'),
    setUsers: function (data) { this.users = data }
};

const bcrypt = require('bcrypt');

//get All Users
const getAllUsers = (req, res) => {
     res.json(usersDB.users )
} 

//update an existing user
const updateUser =  async (req, res) => {
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
    const filteredArray = usersDB.users.filter(person => person.id !== parseInt(req.body.id));
    const unsortedArray = [...filteredArray, foundUser];
    usersDB.setUsers(unsortedArray.sort((a, b) => a.id > b.id ? 1 : a.id < b.id ? -1 : 0));
    res.json(usersDB.users);
}

//delete an existing user
const deleteUser = (req, res) => {
        //find user
        const foundUser = usersDB.users.find(user => user.id === req.body.id);
        //user check
        if(!foundUser) return res.status(401).json({ "message": `User ID not found` });
        const updatedUsers = usersDB.users.filter(person => person.id !== parseInt(req.body.id));
        usersDB.setUsers(updatedUsers);
        res.json({ "message": `User with ID ${req.body.id} has been deleted` });
}

//get a particular user by id
const getUser = (req, res) => {
    const user = usersDB.users.find(person => person.id === parseInt(req.params.id));
    if (!user) {
        return res.status(400).json({ "message": `User with ID ${req.params.id} not found` });
    }
    res.json(user);
}

module.exports = {
    getAllUsers,
    updateUser,
    deleteUser,
    getUser
}