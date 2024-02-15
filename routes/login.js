//login routes
const express = require('express');
const router = express.Router();
const Login = require('../model/login');
const bcrypt = require('bcrypt');
// const cookies = require('cookie-parser') 
const jwt = require('jsonwebtoken')
// const {authentication} = require('../middleware/tokenAuth')
require ('dotenv').config();
router.post('/register', (req,res) => {
    const {username, password} = req.body
    bcrypt.hash(password, 10)
        .then((hash) => {
            const store = new Login({
                username: username,
                password: hash
            })
            store.save();
            res.json("USER REGISTERED")
        })
        .catch(() => {
            res.json({error: "SOMETHING WENT WRONG"})
        })
    
})

router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    console.log(username);
    const usernameVerify = await Login.findOne({ username: username });
    
    if (!usernameVerify) {
        return res.status(400).json({ error: "Username does not exist" });
    }
    
    const verification = usernameVerify.password;
    console.log(verification);
    
    bcrypt.compare(password, verification).then((match) => {
        if (!match) {
            return res.status(400).json({ error: "Password is incorrect" });
        }
        
        // Password matches, user is authenticated

        //accessing username
        const accessUser = {name: username}
        //create jwt by using secret key and sign method
        //whenever user pass username ,it is going to create token for that contains relevant information to the user
        const token = jwt.sign(accessUser, process.env.ACCESS_TOKEN_SECRET)
        res.json({token: token})
        res.json({ message: "User logged in! Congrats" });





    }).catch((error) => {
        console.error("Error comparing passwords:", error);
        res.status(500).json({ error: "Internal server error" });
    });


});

router.get('/',authentication, (req,res) => {
    res.json(req.accessUser)
})

//create middleware for authentication

function authentication (req,res,next){
    const getAuthorizationHeader = req.headers['authorization'];
    const token = getAuthorizationHeader && getAuthorizationHeader.split(' ')[1]
    if(!token){
        
        return res.sendStatus(403)
    }
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, accessUser) => {
        if(err){
            console.error('JWT verification error:', err);
            return res.sendStatus(403)
        }else{
            req.accessUser = accessUser
            next()
        }
    })


}






module.exports = router