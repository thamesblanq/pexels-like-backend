const usersDB = {
    users: require('../models/users.json'),
    setUsers: function (data) { this.users = data }
};

const bcrypt = require('bcrypt');

const getAllUser = (req, res) => {
     res.json(usersDB.users )
} 

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
    foundUser.firstname = req.body.firstname ?  req.body.firstname : foundUser.firstname;
    foundUser.lastname = req.body.lastname  ? req.body.lastname : foundUser.lastname;
    foundUser.username = req.body.username ? req.body.username : foundUser.username;
    if(req.body.password) foundUser.password = newPwd;

    const filteredArray = usersDB.users.filter(person => person.id !== parseInt(req.body.id));
    const unsortedArray = [...filteredArray, foundUser];
    usersDB.setUsers(unsortedArray);
    res.json(usersDB.users);
}