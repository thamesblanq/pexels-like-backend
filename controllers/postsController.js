const postsDB = {
    posts: require('../models/posts.json'),
    setPosts: function (data) { this.users = data }
};
const { format } = require('date-fns');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const fsPromises = require('fs').promises;

//working
const getAllPosts = (req, res) => {
    return res.json(postsDB.posts);
}


//not working
const createNewPost = async (req, res) => {
    const { userID, desc, tags, imagesUrl, createdBy } = req.body;
    //tags are optional.... i'll create the postID and dateCreated properties
    if (!userID || !desc || !imagesUrl || !createdBy) {
        return res.status(400).json({ "message": `userID, description and imagesUrl and createdBy input are needed` });
    }
  
    try {
        //create post 
        const newPost = {
            "userID": userID,
            "postID": uuidv4(),
            "desc": desc,
            "tags": tags || [],
            "imagesUrl": imagesUrl,
            "dateCreated": format(new Date(), "hh-dd-MM-yy"),
            "createdBy": createdBy
        }
        //add post to DB
        postsDB.setPosts([...postsDB.posts, newPost]);
        // Write the updated postsDB.posts array to the JSON file
        await fsPromises.writeFile(
          path.join(__dirname, '..', 'models', 'posts.json'),
          JSON.stringify(postsDB.posts)
        );
        console.log(newPost);
        return res.status(201).json({ "message": `New post created at ${newPost.dateCreated}` }); // Return the newly created post
      } catch (err) {
        console.log("Error writing to JSON file:", err);
        return res.status(500).json({ message: "Internal server error" });
      }
}


//working
const updatePost = (req, res) => {
    const { desc, tags, imagesUrl, postID } = req.body; 
    //find post by id
    const foundPost = postsDB.posts.find(post => post.postID === postID)
    if(!foundPost) return res.status(400).json({ "message": `Post with ID ${postID} does not exist.` });//Bad Request

    //update what can be changed
    if(desc) foundPost.desc = desc;
    if(tags) foundPost.tags = tags;
    if(imagesUrl) foundPost.imagesUrl = imagesUrl;
    foundPost.dateCreated = format(new Date(), "hh-dd-MM-yy");

    const updatedPost = {
        "userID": foundPost.userID,
        "postID": foundPost.postID,//use postID to get post
        "desc": foundPost.desc,
        "tags": foundPost.tags,
        "imagesUrl": foundPost.imagesUrl,
        "dateCreated":  foundPost.dateCreated,
        "createdBy": foundPost.createdBy
    }

    const otherPosts = postsDB.posts.filter(post => post.postID !== foundPost.postID);
    postsDB.setPosts([...otherPosts, updatedPost]);
    console.log(updatedPost);
    return res.json(postsDB.posts);

}


//not working
const deletePost = (req, res) => {
    const { postID } = req.body;
       //find post by id
       const foundPost = postsDB.posts.find(post => post.postID === postID)
       if(!foundPost) return res.status(400).json({ "message": `Post with ID ${postID} does not exist.` });//Bad Request

       const otherPosts = postsDB.posts.filter(post => post.postID !== postID);
       postsDB.setPosts([...otherPosts]);
       console.log(otherPosts);
       console.log(foundPost);
       return res.json({ "message": `Post with ID ${postID} has been deleted` });

}


//working
const getPostByID = (req, res) => {
    const post = postsDB.posts.find(post => post.postID === req.params.id.toString());
    if(!post) return res.status(400).json({ "message": `No post with ID ${req.params.id}.` });
    return res.json(post);
}

module.exports = {
    getAllPosts,
    createNewPost,
    updatePost,
    deletePost,
    getPostByID
}