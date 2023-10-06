const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  userID: {
    type: Number,
    required: true,
  },
  postID: {
    type: String,
    required: true,
    unique: true,
  },
  desc: {
    type: String,
    required: true,
  },
  tags: {
    type: [String],
    default: [],
  },
  imagesUrl: {
    type: [String],
    required: true,
  },
  dateCreated: {
    type: Date,
    default: Date.now,
  },
  createdBy: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('Post', postSchema);
