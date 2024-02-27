////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//import necessary module

import express, {Request,Response, NextFunction, Router} from 'express'
import postModel , { Ipost } from "../model/postModel";
import Login from '../model/login'
import multer from 'multer';
import cookieParser from 'cookie-parser'; 
import path from 'path'
import passport from 'passport';
import { Strategy, ExtractJwt } from 'passport-jwt'
import { StrategyOptions } from 'passport-jwt';
require ('dotenv').config();

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
const router:Router = express.Router();
require('dotenv').config()
router.use(cookieParser())
router.use(passport.initialize())
router.use(express.json())
router.use('/uploads', express.static('/uploads'));

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//upload image to the blog by using multer
//filename must be unique to prevent overwriting of files

const storage = multer.diskStorage({
    destination: 'uploads/',
    filename: (req, file, cb) => {
        return cb(null, `${file?.fieldname}_${Date.now()}${path.extname(file?.originalname)}` ) //this takes two parameters error and return value.extname is extension name
    }
})
const upload = multer ({
    storage : storage
})
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

router.get('/retrieveallpost', authenticateToSeeAllBlogIn);
router.post('/postblog', upload.single('image'),authenticateToPostBlog)
router.get('/getsinglepost/:id',accessSingleBlog)
router.delete('/deletepost/:id',deleteSingleBlog)
router.patch('/updatepost/:id', updateSingleBlog)

export async function authenticateToSeeAllBlogIn (req:Request, res:Response, next: Function) {
    passport.authenticate('jwt', {session:false}, async(err:any, user:any, info:any)=>{
        try{
            if(err){
                return next(err)
            }
            if(!user){

                return res.status(400).json({status: 400, error: "invalid token"})
    
            }
            //const posts = await postModel.find().populate({
            //    path: 'comment',
            //    options: {
            //       strictPopulate : false
            //   }
            //});
            const posts = await postModel.find()
            res.json({status: 200, data:posts});
        } catch(error){
            next(error)
        }
        

    })(req,res,next)
    
}

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

async function accessSingleBlog (req:Request, res:Response, next: Function) {
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

async function deleteSingleBlog (req:Request, res:Response, next: Function) {
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

async function updateSingleBlog (req:Request, res:Response, next: Function) {
    passport.authenticate('jwt', {session:false}, async(err:any, user:any, info:any)=>{
        try{
            if(err){
                return next(err)
            }
            if(!user){
                return res.status(400).json({status: 400, error: "invalid token"})
    
            }
            const updatedPost = await postModel.findByIdAndUpdate(req.params.id, {
                $set: {
                    title: req.body.title,
                    content: req.body.content,
                    description: req.body.description
                }
            }, {new: true});
            if(updatedPost === null) res.status(400).json({status: 400, error: "id not found"})
            console.log(updatedPost)
            res.json({status: "ok",copyAndUpdate:  updatedPost});
        } catch(error){
            next(error)
        }
        

    })(req,res,next)
    
}

/////////////////////////////////////////////////////////////////////////////////////////

const jwtOptions:StrategyOptions  = {
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


///////////////////////////////////////////////////////////////////////////////////////////////////

export default router
