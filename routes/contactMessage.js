const express = require("express");
const router = express.Router();
const Contact = require("../model/contactInq");
const jwt = require('jsonwebtoken')
const Login = require('../model/login');
require('dotenv').config()

router.post('/login', (req,res) => {
    const {username} = req.body
    const usernameVerify = Login.findOne({ username});
    if(!usernameVerify){
        res.json({error:"invalid credentials"})
    }
    const accUsername = {name: username}
    console.log(accUsername)
    const generateToken = jwt.sign(accUsername, process.env.ACCESS_CONTACT_TOKEN)
    res.json({token: generateToken})

})



router.post('/contactMessage', (async(req,res) => {
    const contact = new Contact({
        fullName: req.body.fullName,
        email: req.body.email,
        message: req.body.message
    })
    try{
        const postMessage = await contact.save();
        res.json("send successfully")
    } catch(error){
        res.status(401).json({message: error})
    }
}))

//check if the username is the one trying to access the contact form 

router.get('/contactMessage',authenticateUser, async(req,res) => {
    try{
        const {name} = req.decoded
        const contacts = await Contact.find({name: name});
        //securing read operation

        res.json(contacts);
    } catch(err){
        console.error({message: err});
        res.status(500).send('Server error');
    }
})



function authenticateUser (req,res,next){
    const getHeader = req.headers['authorization'];
    const getToken = getHeader && getHeader.split(' ')[1];
    console.log(getToken)
    if(!getToken) return res.json({error: "Permission Denied"})
    jwt.verify(getToken, process.env.ACCESS_CONTACT_TOKEN, (err, decoded) => {
        if(err) return res.json({error: "invalid token"})
        //set req.contacts = Contact in the verify section
        //set decoded payload in the request body
         req.decoded = decoded
         console.log(req.decoded)
        next()
    })

}
module.exports = router