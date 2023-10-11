const express = require('express');
const router = express.Router();
const usersController = require('../../controllers/usersController');
const verifyJWT = require('../../middleware/verifyJWTs');
const verifyRoles = require('../../middleware/verifyRoles');
const ROLES_LIST = require('../../config/roles_list');

router.route('/')
    .get(verifyRoles(ROLES_LIST.Admin), usersController.getAllUsers)
    .put(verifyRoles(ROLES_LIST.Admin, ROLES_LIST.User), verifyJWT, usersController.updateUser)
    .delete(verifyRoles(ROLES_LIST.Admin, ROLES_LIST.User), verifyJWT, usersController.deleteUser);



router.route('/:id')
    .get(verifyJWT, usersController.getUser);

module.exports = router;