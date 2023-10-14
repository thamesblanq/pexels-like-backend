const express = require('express');
const router = express.Router();
const usersController = require('../../controllers/usersController');
const verifyJWT = require('../../middleware/verifyJWTs');
const verifyRoles = require('../../middleware/verifyRoles');
const ROLES_LIST = require('../../config/roles_list');

router.route('/')
    .get(verifyJWT, usersController.getAllUsers)
    .put(verifyJWT, verifyRoles(ROLES_LIST.Admin, ROLES_LIST.User), usersController.updateUser)
    .delete(verifyJWT, verifyRoles(ROLES_LIST.Admin, ROLES_LIST.User), usersController.deleteUser);



router.route('/:username')
    .get(verifyJWT, usersController.getUser);

module.exports = router;