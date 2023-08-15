// models/Post.js

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const postSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    url: String,
    title: String,
    price: String,
    description: String,
    reviews: String,
    ratings: String,
    mediaCount: String,
});

const Post = mongoose.model('Post', postSchema);

module.exports = Post;
