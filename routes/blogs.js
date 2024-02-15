//get blogs,update it ,delete it and securing it with jwt

const express = require("express");
const router = express.Router();
const postModel = require("../model/postModel");
const Contact = require("../model/contactInq");
const Login = require('../model/login');
const jwt = require('jsonwebtoken')
require('dotenv').config()
router.get("/", (req, res) => {
    res.send("come to dad")
})
router.get('/retrieveAllPost', async(req,res)=> {
    try{
        const posts = await postModel.find();
        res.json(posts);
    } catch(err){
        console.error({message: err});
        res.status(500).send('Server error');
    }
})

router.post('/login', (req,res) => {
    const {username} = req.body;
    const findUsername = Login.findOne({ username});
    if(!findUsername){
        res.json({error:"invalid credentials"})
    }
    const accUsername = {name: username};
    const token = jwt.sign(accUsername, process.env.ACCESS_WRITE_BLOG)
    res.json({token: token})
    
})


//create middleware for checking if the user is authenticated or not
function accessToWrite(req,res,next){
    const getHeader = req.headers['authorization'];
    const getToken = getHeader && getHeader.split(' ')[1];
    if(!getToken) return res.json({error: "Permission Denied"})
    jwt.verify(getToken, process.env.ACCESS_WRITE_BLOG, (err, decoded)=>{
        if(err) return res.json({error: "invalid token"});
        req.decoded = decoded
        next()
    })
    

}
router.post('/postBlog',accessToWrite, async(req,res) => {
    const post = await postModel({
        title: req.body.title,
        content: req.body.content,
        description: req.body.description

    });
    try {
        const savedPost = await post.save();
        res.json(savedPost);
    } catch (err) {
        console.error({message: err});
    }
})

//get single post by id

router.get('/getSinglePost/:id', async (req,res) =>{
    try{
        const singlePost = await postModel.findById(req.params.id);
        res.json(singlePost);
    } catch(err){
        console.error({message: err});
        res.status(404).send('Not Found');
    }
})

router.patch('/updatePost/:id', async(req,res) =>{
    try{
        const updatedPost = await postModel.findByIdAndUpdate(req.params.id, {
            $set: {
                title: req.body.title,
                content: req.body.content,
                description: req.body.description
            }
        }, {new: true});
        res.json(updatedPost);
    } catch(err){
        console.error({message: err});
        res.status(500).send('Server error');
    }
})

router.delete('/deletePost/:id', async(req,res) =>{
    try{
        const deletedPost = await postModel.findByIdAndDelete(req.params.id);
        res.json(deletedPost);
    }catch(err){
        console.log(err);
        res.status(500).send("Internal Server Error")
    }
})

module.exports = router