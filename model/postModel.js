const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    
    description: {
        type: String,
        required: true
    },
    image: String,
    created_at: { 
        type: Date, 
        default: Date.now 
    },
});

const Post = mongoose.model('post', postSchema);
module.exports = Post;