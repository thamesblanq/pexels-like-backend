const express = require('express');
const router = express.Router();
const postsController = require('../../controllers/postsController');
const verifyJWT = require('../../middleware/verifyJWTs');
const verifyRoles = require('../../middleware/verifyRoles');
const ROLES_LIST = require('../../config/roles_list');

router.route('/')
    .get(postsController.getAllPosts)
    .post(verifyJWT, verifyRoles(ROLES_LIST.Admin, ROLES_LIST.User), postsController.createNewPost)
    .put(verifyJWT, verifyRoles(ROLES_LIST.Admin, ROLES_LIST.User), postsController.updatePost)
    .delete(verifyJWT, verifyRoles(ROLES_LIST.Admin, ROLES_LIST.User), postsController.deletePost);


router.route('/:postIDOrUsername')
    .get(postsController.getPostOrUser);

/* router.route('/:postID')
    .get(postsController.getPostOrUser); */




module.exports = router;