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

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//after dealing with function,next is to configure passport by calling initialize and session from express-session()

router.use(cookieParser())
router.use(express.json())
router.use(passport.initialize())

router.post('/register', async(req:customD,res:Response) => {
    const result = registerSchema.validate(req.body, options)
    if(result.error){
        const messageError = result.error.details.map((error:any) => error.message).join(', ')
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
                        res.json({status: "ok",message:"USER REGISTERED", redirectTo: "../login-page/login.html"})

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
//define strateg

passport.use(new LocalStrategy(validateUser))

router.post('/login',async(req:customD,res:Response, next: Function)=> {
    try{

        passport.authenticate('local', {session: false}, async(err: Error, user: any) => {
            if(err){
                return next(err)
            }
            if(!user){
                return res.status(400).json({status: 400, error: "invalid username or password"})
            }
            
            const accessUser = {username:req.body.username, password: req.body.password}
            console.log(accessUser)
            console.log("hello",accessUser)
            const token =  jwt.sign(accessUser, process.env.ACCESS_TOKEN_SECRET!)
            res.cookie("token", token)
            res.header('Authorization', `Bearer ${token}`)
            res.json({ status: "ok",message: "User logged in! Congrats", token: token})
            console.log("token", token)
    
            
        })(req,res,next)
    } catch(err){
        next(err)
    }
    
})




export default router; 