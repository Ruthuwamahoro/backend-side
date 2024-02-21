
import express, { Request, Response , NextFunction, Router } from 'express'
const router:Router = express.Router();
import Contact, {contact} from "../model/contactInq";
import jwt from 'jsonwebtoken';
import Login from '../model/login'
import dotenv from 'dotenv'
import passport from 'passport'
import {Strategy, ExtractJwt} from 'passport-jwt'
import { StrategyOptions } from 'passport-jwt';
dotenv.config()


interface customD extends Request {
    decoded?: any
}

/////////////////////////////////////////////////////////////////////////////////////////////////

//define middleware

router.use(express.json())
router.use(passport.initialize())




///////////////////////////////////////////////////////////////////////////////////////////////////////////////



router.post('/contactmessage', allowUserToSubmitMessage)
router.get('/contactmessage', retrieveAllMessage ) 





async function allowUserToSubmitMessage(req:customD,res:Response,next:NextFunction){
    passport.authenticate('jwt', {session: false}, async(err:any, user:any, info:any) =>{
        try{
            if(err){
                return next(err);
            } if(!user){
                return res.status(401).json({status: 401, error: "please login is required"})
            }
            const contact1:contact = new Contact({
                fullName: req.body.fullName,
                email: req.body.email,
                message: req.body.message
            })
            const postMessage = await contact1.save();
            res.json({status: "ok",copyAndUpdate: postMessage});


        } catch(err){
            next(err)
        }
    })(req,res,next)
}

async function retrieveAllMessage(req:Request, res:Response, next:Function){
    passport.authenticate('jwt', {session: false}, async (err:any, user: any, info: any) => {
        try{
            if(err){
                return next(err)
            } 
            if(!user) return res.status(401).json({status: 401, error: "please login is required"})
            const contacts = await Contact.find();
            res.json({messages: contacts})

        } catch(err){
            next(err)
        }
    })(req,res,next)

}




//////////////////////////////////////////////////////////////////////////////////////////////////

//defining startegy

const jwtOptions:StrategyOptions ={
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.ACCESS_TOKEN_SECRET || 'heyyou'
}

passport.use(new Strategy(jwtOptions, async(jwtPayload, done:Function)=>{
    try{
        const user = await Login.findOne({username: jwtPayload.username});
        if(user){
            return done(null, user)
        } else {
            return done(null, false)
        }
    } catch(err){
        return done(err)
    }
}))


export default router; 