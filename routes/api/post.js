const express = require('express');
const router = express.Router();
const postsController = require('../../controllers/postsController');

router.route('/')
    .get(postsController.getAllPosts)
    .post(postsController.createNewPost)
    .put(postsController.updatePost)
    .delete(postsController.deletePost);



router.route('/:id')
    .get(postsController.getPostByID);

module.exports = router;