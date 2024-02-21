import express, {Request, Response, NextFunction, Router} from 'express'
const router:Router = express.Router();
import Project from '../model/projectsModel'
import cookieParser from 'cookie-parser'; 

import { Strategy, ExtractJwt } from 'passport-jwt';
import { StrategyOptions } from 'passport-jwt';
import passport from 'passport'

require('dotenv').config()
import Login from '../model/login'

//////////////////////////////////////////////////////////////////////////////////


//define middleware
router.use(cookieParser())
router.use(express.json())
router.use(passport.initialize())

/////////////////////////////////////////////////////////////////////////////////////

//define routes


router.get('/getallprojects', allowUserToSeePostedProject)
router.post('/postproject', allowPostProject)
router.patch('/updateproject/:id', allowUpdateProject)
router.delete('/deleteproject/:id', allowDeleteProject)





////////////////////////////////////////////////////////////////////////////////////////////////////

//jwt strategy


const jwtOptions: StrategyOptions = {  //const will throw error if the function is not called in the routes
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.ACCESS_TOKEN_SECRET || 'heyyou'
}

async function allowUserToSeePostedProject(req:Request, res:Response, next:NextFunction) {
    passport.authenticate('jwt', {session: false}, async(err:any, user:any, info:any) => {
        try{
            if(err){
                return next()
            }
            if(!user){
                return res.status(400).json({status: 400, error: "please login is required"})
            }
            const projects = await Project.find();
            res.json({projects: projects})
        } catch(err){
            return next(err)
        }
    })(req,res,next)
}


async function allowPostProject (req:Request, res:Response, next:NextFunction) {
    passport.authenticate('jwt', {session: false}, async(err:any, user:any, info:any) => {
        try{
            if(err){
                return next(err)
            }
            if(!user){
                return res.status(400).json({status: 400, error: "please login is required"})
            }
            const {title, description, demo} = req.body;
            const project = new Project({
                title, 
                description,  
                demo
            })
            await project.save()
            res.json("project posted")
        } catch(err){
            return next(err)
        }
    })(req,res,next)
}


async function allowUpdateProject (req:Request, res:Response, next:NextFunction) {
    passport.authenticate('jwt', {session: false}, async(err:any, user:any, info:any) => {
        try{
            if(err){
                return next(err)
            }
            if(!user){
                return res.status(400).json({status: 400, error: "please login is required"})
            }
            const updatePro = await Project.findByIdAndUpdate(req.params.id, {
                $set: {
                    title: req.body.title,
                    content: req.body.content,
                    description: req.body.description
                }
            }, {new: true});
            if(updatePro === null)return res.json({error: "id not found"})
            res.json("Project Updated Successfully")
        } catch(err){
            return next(err)
        }
    })(req,res,next)
}

async function allowDeleteProject (req:Request, res:Response, next:NextFunction) {
    passport.authenticate('jwt', {session: false}, async(err:any, user:any, info:any) => {
        try{
            if(err){
                return next(err)
            }
            if(!user){
                return res.status(400).json({status: 400, error: "please login is required"})
            }
            const deletePro = await Project.findByIdAndDelete(req.params.id)
            if (!deletePro) return res.status(400).send({msg:"id not found"})
            res.json("Project Deleted Successfully")
        } catch(err){
            return next(err)
        }
    })(req,res,next)
}


/////////////////////////////////////////////////////////////////////////////////////////////////////////

//define strategy

passport.use(new Strategy(jwtOptions, async(jwtPayload, done:Function) => {
    try{
        const user = await Login.findOne({username: jwtPayload.username}); 
        if(!user){
            done(null, false)
        } else {
            done(null, user)
        }
    } catch(err){
        done(err)
    }
    

} ))


//////////////////////////////////////////////////////////////////////////////////////////////////

export default router; 