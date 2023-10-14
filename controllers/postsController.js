const Post = require('../models/Post');
const { format } = require('date-fns');
const { v4: uuidv4 } = require('uuid');


const getAllPosts = async (req, res) => {
    try{
        const posts = await Post.find().exec();
        return res.json(posts);
    } catch (err) {
        console.log(err.message);
        res.status(500).json({ "message": "Internal server error"})
    }
    
}


const createNewPost = async (req, res) => {
    const { desc, tags, imagesUrl, username } = req.body;
    //tags are optional.... i'll create the postID and dateCreated properties
    if (!desc || !imagesUrl || !username ) {
        return res.status(400).json({ "message": `Description and imagesUrl input are needed` });
    }
  
    try {
        // Write the updated to DB
        const result = await Post.create({
            "postID": uuidv4(),
            "desc": desc,
            "tags": tags || [],
            "imagesUrl": imagesUrl,
            "dateCreated": format(new Date(), "yyyy-MM-dd'T'HH:mm:ss.SSSxxx"),
            "createdBy": username
        });
        return res.status(201).json({ "message": `New post created at ${result.dateCreated}` }); // Return the newly created post
      } catch (err) {
        console.log("Error writing to JSON file:", err);
        return res.status(500).json({ message: "Internal server error" });
      }
}

const updatePost = async (req, res) => {
    const { desc, tags, imagesUrl, postID } = req.body;

    // Find the post by postID
    const foundPost = await Post.findOne({ postID: postID }).exec();

    if (!foundPost) {
        return res.status(400).json({ "message": `Post with ID ${postID} does not exist.` });
    }

    try {
        // Update what can be changed
        if (desc !== undefined) {
            foundPost.desc = desc;
        }
        if (tags !== undefined) {
            foundPost.tags = tags;
        }
        if (imagesUrl !== undefined) {
            foundPost.imagesUrl = imagesUrl;
        }
        
        // Update the dateCreated field to the current date and time
        foundPost.dateCreated = format(new Date(), "yyyy-MM-dd'T'HH:mm:ss.SSSxxx");

        const result = await foundPost.save();
        return res.status(200).json({ "message": "Success" });
    } catch (err) {
        console.log(err.message);
        res.status(500).json({ "message": "Internal server error" });
    }
}


const deletePost = async (req, res) => {
    const { postID } = req.body;
    //find post by id
    const foundPost = await Post.findOne({ postID: postID }).exec();
    if(!foundPost) return res.status(404).json({ "message": `Post with ID ${postID} does not exist.` });//Bad Request
    try{
        const result = await foundPost.deleteOne();
        return res.json({ "message": `Post with ID ${postID} has been deleted` });
    } catch(err){
        console.log(err.message);
        res.status(500).json({ "message": "Internal server error" })
    }
}

const getPostOrUser = async (req, res) => {
    const { postIDOrUsername } = req.params;
  
    // Check if it's a valid UUID to determine if it's a postID
    if (isValidUUID(postIDOrUsername)) {
      try {
        const post = await Post.findOne({ postID: postIDOrUsername }).exec();
        if (!post) {
          return res.status(404).json({ "message": `No post with ID ${postIDOrUsername}.` });
        }
        return res.json(post);
      } catch (err) {
        console.log(err.message);
        return res.status(500).json({ "message": "Internal server error" });
      }
    } else {
      // If it's not a valid UUID, treat it as a request to get posts by username
      try {
        const foundPosts = await Post.find({ createdBy: postIDOrUsername }).exec();
        return res.status(200).json(foundPosts);
      } catch (err) {
        console.log(err.message);
        return res.status(500).json({ "message": 'Internal server error' });
      }
    }
  };
  
  function isValidUUID(str) {
    //uuid comprises of 36 chars
    return typeof str === 'string' && str.length === 36
  }
  
  
  
  

module.exports = {
    getAllPosts,
    createNewPost,
    updatePost,
    deletePost,
    getPostOrUser
}