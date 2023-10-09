const express = require('express');
const router = express.Router();
const usersController = require('../../controllers/usersController');
const verifyJWT = require('../../middleware/verifyJWTs');

router.route('/')
    .get(usersController.getAllUsers)
    .put(verifyJWT, usersController.updateUser)
    .delete(verifyJWT, usersController.deleteUser);



router.route('/:id')
    .get(verifyJWT, usersController.getUser);

module.exports = router;