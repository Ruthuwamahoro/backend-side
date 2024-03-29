
import express, { Request, Response , NextFunction, Router } from 'express'
const Crouter:Router = express.Router();
import Contact, {contact} from "../model/contactInq";
import jwt from 'jsonwebtoken';
import Login from '../model/login'
import dotenv from 'dotenv'
import passport from 'passport'
import {Strategy, ExtractJwt} from 'passport-jwt'
import { StrategyOptions } from 'passport-jwt';
import axios from 'axios';
dotenv.config()


interface customD extends Request {
    decoded?: any
}

// /////////////////////////////////////////////////////////////////////////////////////////////////

// //define middleware

Crouter.use(express.json())
Crouter.use(passport.initialize())


///////////////////////////////////////////////////////////////////////////////////////////////////////////////

Crouter.post('/contactmessage', allowUserToSubmitMessage)
Crouter.get('/contactmessage', retrieveAllMessage ) 


export async function allowUserToSubmitMessage(req:customD,res:Response,next:NextFunction){
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
            res.json({status: "ok",message: "Thank you for your message. We'll get back to you shortly."});


        } catch(err){
            next(err)
        }
    })(req,res,next)
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


export default Crouter

// router.post('/contactmessage',authenticateUser, (async(req:customD,res:Response) => {
//     const contact1:contact = new Contact({
//         fullName: req.body.fullName,
//         email: req.body.email,
//         message: req.body.message
//     })
//     try{
//         const postMessage = await contact1.save();
//         res.json("send successfully")
//     } catch(error){
//         res.status(401).json({message: error})
//     }
// }))


// router.get('/contactmessage',authenticateUser, (async(req:customD,res:Response) => {
//     try{
//         const postMessage = await Contact.find();
//         res.json({status: "ok",messages: postMessage})
//     } catch(error){
//         res.status(401).json({message: error})
//     }
// }))



// function authenticateUser (req:customD,res:Response,next:NextFunction){
//     const getHeader = req.headers['authorization'];
//     const getToken = getHeader && getHeader.split(' ')[1];
//     console.log(getToken)
//     if(!getToken) return res.json({error: "Permission Denied"})
//     jwt.verify(getToken, process.env.ACCESS_TOKEN_SECRET!, (err: Error | null, decoded: any) => {
//         if(err) return (res.status(401) as any).json({error: "invalid token"})
//         req.decoded = decoded
//         next()
//     })

// }
// export default Crouter; 


// Crouter.post('/contactmessage',authenticateUser, (async(req:customD,res:Response) => {
//     const contact = new Contact({
//         fullName: req.body.fullName,
//         email: req.body.email,
//         message: req.body.message
//     })
//     try{
//         const postMessage = await contact.save();
//         res.json("send successfully")
//     } catch(error){
//         res.status(401).json({message: error})
//     }
// }))

// //check if the username is the one trying to access the contact form 

// Crouter.get('/contactmessage',authenticateUser, async(req:customD,res:Response) => {
//     try{
//         const {name} = req.decoded
//         const contacts = await Contact.find({name: name});
//         //securing read operation

//         res.json(contacts);
//     } catch(err){
//         console.error({message: err});
//         res.status(500).send('Server error');
//     }
// })



// function authenticateUser (req:customD,res:Response,next:NextFunction){
//     const getHeader = req.headers['authorization'];
//     const getToken = getHeader && getHeader.split(' ')[1];
//     console.log(getToken)
//     if(!getToken) return res.json({error: "Permission Denied"})
//     jwt.verify(getToken, process.env.ACCESS_TOKEN_SECRET!, (err: Error | null, decoded: any) => {
//         if(err) return res.json({error: "invalid token"})
//          req.decoded = decoded
//          console.log(req.decoded)
//         next()
//     })

// }
// export default Crouter;