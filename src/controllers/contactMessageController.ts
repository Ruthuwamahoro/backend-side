import express, { Request, Response , NextFunction, Router } from 'express'
const Crouter:Router = express.Router();
import Contact, {contact} from "../model/contactInq";
import Login from '../model/login'
import dotenv from 'dotenv'
import passport from 'passport'
import { contactMessageSchema, options } from '../validator/validateuser';
import {Strategy, ExtractJwt} from 'passport-jwt'
import { StrategyOptions } from 'passport-jwt';
dotenv.config()

interface customD extends Request {
    decoded?: any
}


export async function allowUserToSubmitMessage(req:Request, res:Response, next:NextFunction){
    try{
        const mess = contactMessageSchema.validate(req.body, options)
        if(mess.error){
            const messageError = mess.error.details.map((error:any) => error.message).join(', ')
            return res.status(400).json({status: 400, error: messageError})
        }
        const contact1:contact = new Contact({
            fullName: req.body.fullName,
            email: req.body.email,
            message: req.body.message
        })
        const postMessage = await contact1.save();
        res.json({status: "ok",message: "Thank you for your message. We'll get back to you shortly."});

    } catch(e){
        console.log(e)
    }
}





export async function retrieveAllMessage(req:Request, res:Response, next:Function){
    passport.authenticate('jwt', {session: false}, async (err:any, user: any, info: any) => {
        try{
            if(err){
                return next(err)
            } 
            if(!user) return res.status(401).json({status: 401, error: "please login is required"})
            const contacts = await Contact.find();
            res.status(200).json({messages: contacts})

        } catch(err){
            next(err)
        }
    })(req,res,next)

}
export async function deleteMessage(req:Request, res:Response, next:Function){
    passport.authenticate('jwt', {session:false}, async(err:any, user:any, info:any)=>{
        try{
            if(err){
                return next(err)
            }
            if(!user){
                return res.status(400).json({status: 400, error: "invalid token"})
    
            }
            const getId = req.params.id
            await Contact.findByIdAndDelete(getId);
            res.json({status: "ok",data:"successfully deleted messages"});
        } catch(error){
            next(error)
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