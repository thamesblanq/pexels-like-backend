const express = require('express');
const router = express.Router();
const postsController = require('../../controllers/postsController');
const verifyJWT = require('../../middleware/verifyJWTs')

router.route('/')
    .get(postsController.getAllPosts)
    .post(verifyJWT, postsController.createNewPost)
    .put(verifyJWT, postsController.updatePost)
    .delete(verifyJWT, postsController.deletePost);



router.route('/:id')
    .get(postsController.getPostByID);

module.exports = router;