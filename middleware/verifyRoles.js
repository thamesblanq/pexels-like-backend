const verifyRoles = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req?.roles) return res.status(401).json({ "message": "Unauthorized" });
        const rolesArray = [...allowedRoles];
        console.log(`Request roles ${req.roles}`);
        console.log(`DB roles${rolesArray}`);
        // the first part creates an array with true or false values checking all the roles in the DB and comparing them with the req.roles from user... if the role is found, it returns true, else it returns false, the the second HOF which is find() checks the newly created array comprising of true and false to find the first true... if it does the result will return true els it will return false and access will be prohibited  
        const result = req.roles.map(role => rolesArray.includes(role)).find(val => val === true);
        if(!result) return res.status(401).json({ "message": "No authorized to perform this action" });
        next()
    }
}

module.exports = verifyRoles
