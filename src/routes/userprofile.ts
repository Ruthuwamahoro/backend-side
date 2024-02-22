import express, { Request, Response,NextFunction } from 'express'
import {registerSchema, options} from '../validator/validateuser'
import Login from '../model/login'
import jwt from 'jsonwebtoken'
import cookieParser from 'cookie-parser';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { StrategyOptions } from 'passport-jwt';
import Profile from '../model/profile'
import passport from 'passport'


const userRouter = express.Router()
require('dotenv').config()

userRouter.use(passport.initialize())

userRouter.post('/profile', userInfoProfile)
const token:any = ExtractJwt.fromAuthHeaderAsBearerToken()
const secKey = process.env.ACCESS_TOKEN_SECRET! 
async function userInfoProfile(req:Request, res:Response, next:NextFunction){
    passport.authenticate('jwt', {session: false}, async(err:any, user:any, info:any) => {
        try{
            if(err){
                return next(err)
            }
            const decodingFromToken = jwt.verify(token, secKey) as any
            const usernameIn = decodingFromToken.username
            const userPro = new Profile({
                username: usernameIn,
                status: "active"
            })
            await userPro.save()
    
        } catch(err){
            next(err)
        }
    })(req,res,next)
}





const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.ACCESS_TOKEN_SECRET || 'heyyou'
}
passport.use(new Strategy(jwtOptions, async(jwtPayloads, done: Function) => {
    try{
        const user = await Login.findOne({username: jwtPayloads.username})
        console.log(user)
        if(user){
            return done(null, user)
        } else return done(null, false)
    } catch(err){
        done(err)
    }
}))


export default userRouter

