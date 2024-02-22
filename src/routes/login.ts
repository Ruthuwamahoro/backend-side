//login routes
import express, { Request, Response , NextFunction, Router} from 'express'
import {registerSchema, options} from '../validator/validateuser'
const router:Router = express.Router();
import Login from '../model/login'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import passport from 'passport';
import {Strategy as LocalStrategy} from 'passport-local'
import 'cookie-parser'
import cookieParser from 'cookie-parser';




interface customD extends Request {
    accessUser?: any
}
require ('dotenv').config();

//after dealing with function,next is to configure passport by calling initialize and session from express-session()

router.use(cookieParser())
router.use(express.json())
router.use(passport.initialize())

router.post('/register', async(req:customD,res:Response) => {
    const result = registerSchema.validate(req.body, options)
    if(result.error){
        const messageError = result.error.details.map((error) => error.message).join(', ')
        res.status(400).json({status:400,error: messageError})
    } else {
        const {email, username, password} = result.value
        const checkexistingUser = await Login.findOne({email})
        if(checkexistingUser){
            return res.status(400).json({status: 400,error: "USER WITH THIS EMAIL ALREADY EXISTS"})
        } else {
            const saltRo = 10
            bcrypt.hash(password, saltRo)
                .then(async(hash) => {
                
                        const store =  new Login({
                            email: email,
                            username: username,
                            password: hash,
                            //confirm password is not stored in database because it is unneccessary data it is only used to verify whether user entered correct data
                        })
                        await store.save();
                        res.json({status: "ok",message:"USER REGISTERED"})
                })
                .catch(() => {
                    res.status(400).json({error: "SOMETHING WENT WRONG"})
                })
        }
        
    }
})




async function validateUser (username: string, password: string, done: Function) {
    try {
        const user = await Login.findOne({username})
        if(!user || !await bcrypt.compare(password, user.password)){
            return done(null, false, {message: "User not found"})
        }
        return done(null, user)
        
    } catch(err){
        return done(err)
    }
}
//define strategy

passport.use(new LocalStrategy(validateUser))

router.post('/login',(req:customD,res:Response, next: Function)=> {
    passport.authenticate('local', {session: false}, (err: Error, user: any) => {
        if(err){
            return next(err)
        } 
        if(!user){
            return res.status(400).json({status: 400, error: "invalid username or password"})
        }
        const accessUser = {username: req.body.username, password: req.body.password}
        console.log(process.env.ACCESS_TOKEN_SECRET)
        const token = jwt.sign(accessUser, process.env.ACCESS_TOKEN_SECRET!)
        res.json({ status: "ok",message: "User logged in! Congrats", token: token})
    })(req,res,next)
    
})











// router.post('/login', async(req:customD,res:Response) => {
//     const username = req.body.username;
//     const password = req.body.password
//     if(!username){
//         return res.status(400).json({error: "No provided Username"})
//     } else if(!password){
//         return res.status(400).json({error: "No provided Password"})
//     }

//     const usernameVerify = await Login.findOne({username})
//     const passwordVerify = await Login.findOne({password})
//     if(!usernameVerify && !passwordVerify){
//         return res.status(400).json({status: 400,error: "Username and/ or password does not match"})
//     }else {
//         if(usernameVerify !== null){
//             const verification = usernameVerify.password;
//             bcrypt.compare(password, verification)
//                 .then((match) => {
//                 if (!match) {
//                     return res.status(400).json({status: 400, error: "Password is incorrect" });
//                 }
                
//                 // Password matches, user is authenticated

//                 //accessing username
//                 const accessUser = {name: username, password: password}
//                 //create jwt by using secret key and sign method
//                 //whenever user pass username ,it is going to create token for that contains relevant information to the user
//                 const token = jwt.sign(accessUser, process.env.ACCESS_TOKEN_SECRET!)
//                 res.cookie("token", token);
//                 res.json({ message: "User logged in! Congrats"});
                
//             })
//         }

        
        
//     } 
// })



//create middleware for authentication

// function authentication (req:customD,res:Response,next:NextFunction){
//     const getAuthorizationHeader = req.headers['authorization'];
//     const token = getAuthorizationHeader && getAuthorizationHeader.split(' ')[1]
//     if(!token){
        
//         return res.sendStatus(403)
//     }
//     jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!, (err: Error | null, accessUser) => {
//         if(err){
//             console.error('JWT verification error:', err);
//             return res.sendStatus(403)
//         }else{
//             req.accessUser = accessUser
//             next()
//         }
//     })


// }
export default router; 