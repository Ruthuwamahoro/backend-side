import { Request,Response } from 'express'
import postModel , { Ipost } from "../model/postModel";
import Login from '../model/login'
import passport from 'passport';
import { Strategy, ExtractJwt } from 'passport-jwt'
import { StrategyOptions } from 'passport-jwt';
import dotenv from 'dotenv'
dotenv.config()


/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//handling access of all blog posts

export async function authenticateToSeeAllBlogIn (req:Request, res:Response, next: Function) {
    passport.authenticate('jwt', {session:false}, async(err:any, user:any, info:any)=>{
        try{
            if(err){
                return next(err)
            }
            if(!user){

                return res.status(500).json({status: 500, error: "invalid token"})
    
            }
            const posts = await postModel.find()
            res.status(200).json({status: 200, data:posts});
        } catch(error){
            next(error)
        }
        

    })(req,res,next)
    
}


//handling access of single blog post


export async function accessSingleBlog (req:Request, res:Response, next: Function) {
    passport.authenticate('jwt', {session:false}, async(err:any, user:any, info:any)=>{
        try{
            if(err){
                return next(err)
            }
            if(!user){
                return res.status(400).json({status: 400, error: "invalid token"})
    
            }
            const singlePost = await postModel.findById(req.params.id);
            if(singlePost === null) res.status(400).json({status: 400, error: "id not found"})
            res.json({status: "ok",data:singlePost});
        } catch(error){
            next(error)
        }
        

    })(req,res,next)
    
}

//handling posts the blog

export async function authenticateToPostBlog (req:Request, res:Response, next: Function) {
    passport.authenticate('jwt', {session:false}, async(err:any, user:any, info:any)=>{
        try{
            if(err){
                return next(err)
            }
            if(!user){
                return res.status(400).json({status: 400, error: "invalid token"})
    
            }
            const {title, content, description} = req.body
            const imagePath = `http://localhost:8080/${req.file?.filename}`
             
            console.log(imagePath)
            const post:Ipost = new postModel({
                title,
                content,
                description ,
                image: imagePath || req.file || ''

            });
            await post.save();
            res.json({status: "ok",data:"Successfully posted blog"});
        } catch(error){
            next(error)
        }
        

    })(req,res,next)
    
}


//handling delete blog

export async function deleteSingleBlog (req:Request, res:Response, next: Function) {
    passport.authenticate('jwt', {session:false}, async(err:any, user:any, info:any)=>{
        try{
            if(err){
                return next(err)
            }
            if(!user){
                return res.status(400).json({status: 400, error: "invalid token"})
    
            }
            const getId = req.params.id
            const result = await postModel.findByIdAndDelete(getId);
            if(result === null) res.status(410).json({message: "post already deleted"})
            res.json({status: "ok",data:"successfully deleted post"});
        } catch(error){
            next(error)
        }
    })(req,res,next)
    
}

//handling update single blog

export async function updateSingleBlog (req:Request, res:Response, next: Function) {
    passport.authenticate('jwt', {session:false}, async(err:any, user:any, info:any)=>{
        try{
            if(err){
                return next(err)
            }
            if(!user){
                return res.status(400).json({status: 400, error: "invalid token"})
    
            }
            const newData = req.body
            const updatedPost = await postModel.findByIdAndUpdate(req.params.id, newData, {new: true});
            if(updatedPost === null) res.status(400).json({status: 400, error: "id not found"})
            console.log(updatedPost)
            res.status(200).json({status: "ok",data:  updatedPost});
        } catch(error){
            next(error)
        }
        

    })(req,res,next)
    
}


/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const jwtOptions:StrategyOptions  = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.ACCESS_TOKEN_SECRET || 'heyyou'
}
passport.use(new Strategy(jwtOptions, async(jwtPayload, done:Function)=>{
    try{
        const user = await Login.findOne({username: jwtPayload.username});
        if(user){
            return done(null, user)
        } if(!user){
            return done(null, false)
        } else {
            return done(null, false)
        }
    } catch(err){
        return done(err)
    }
}))


/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////



