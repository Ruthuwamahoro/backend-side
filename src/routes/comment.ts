import express, {Request, Response, NextFunction, Router} from 'express'
const commentRouter:Router = express.Router();
import Comment from '../model/commentSection'
import passport from 'passport'
import { Strategy, ExtractJwt } from 'passport-jwt';
import Login from '../model/login'
import dotenv from 'dotenv'
import postModel from '../model/postModel';
import jwt, { JwtPayload } from 'jsonwebtoken'
dotenv.config()
commentRouter.use(express.json())
commentRouter.use(passport.initialize())
commentRouter.post('/blog/:id/postcomment', allowUserToPostComment)
commentRouter.get('/getallcomment', authenticateToSeeAllCommentIn)
commentRouter.delete('/deletecomment/:id', deleteSingleComment)
commentRouter.post("/comment/:id/postlike", postLikes)


const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey : process.env.ACCESS_TOKEN_SECRET || 'heyyou'
}


export async function allowUserToPostComment (req:Request, res:Response, next: Function) {
    passport.authenticate('jwt', {session:false}, async(err:any, user:any, info:any)=>{
        try{
            if(err){
                return next(err)
            }
            if(!user){
                return res.status(400).json({status: 400, error: "invalid token"})
    
            }
            const token = req.headers.authorization?.split(' ')[1]
            const verification = jwt.verify(token!, process.env.ACCESS_TOKEN_SECRET || 'heyyou') as JwtPayload
            const getusername = verification.username
            const newComment = new Comment ({
                postId: req.params.id,
                commentMessage: req.body.commentMessage, 
                username: getusername
                
            })
            const comment = await newComment.save()
            const getBlog = await postModel.findById(req.params.id);
            if(!getBlog){
                return res.json({error: "invalid id"})
            }
            getBlog.comments.push(comment._id)
            await getBlog.save()
            res.json({status: "ok",comment: comment})

        } catch(error){
            next(error)
        }
    })(req,res,next)
    
}



export async function postLikes (req:Request, res:Response, next: Function) {
    passport.authenticate('jwt', {session:false}, async(err:any, user:any, info:any)=>{
        try{
            if(err){
                return next(err)
            }
            if(!user){
                return res.status(400).json({status: 400, error: "invalid token"})
    
            }
            const getId = req.params.id
            const getUserId = user.id
            const findCommentId = await Comment.findById(getId)
            if(findCommentId?.likes.includes(getUserId)){
                const likesLength = findCommentId?.likes.length
                findCommentId?.likes.splice(likesLength - 1, 1)
                await findCommentId?.save()
                console.log(findCommentId?.likes)
                res.json({"message": "already liked"})

            } else {
                findCommentId?.likes.push(getUserId)
                await findCommentId?.save()
                res.json({"message": "liked"})  
            }
        } catch(error){
            next(error)
        }
    })(req,res,next)

}








export async function accessSingleComment (req:Request, res:Response) {
    try{
        const singlePost = await Comment.findById(req.params.id);
        if(singlePost === null) res.status(400).json({status: 400, error: "id not found"})
        res.json({status: "ok",data:singlePost});

    } catch(err){
        console.log(err)
    }
    
}
export async function deleteSingleComment (req:Request, res:Response, next: Function) {
    passport.authenticate('jwt', {session:false}, async(err:any, user:any, info:any)=>{
        try{
            if(err){
                return next(err)
            }
            if(!user){
                return res.status(400).json({status: 400, error: "invalid token"})
    
            }
            const getId = req.params.id
            const result = await Comment.findByIdAndDelete(getId);
            res.json({status: "ok",data:"successfully deleted comment"});
        } catch(error){
            next(error)
        }
    })(req,res,next)
    
}

export async function authenticateToSeeAllCommentIn(req:Request, res:Response) {
    try{
        const postComment = await Comment.find()
        res.status(200).json({status: 200, data:postComment});
    } catch(err){
        console.log(err)
        res.status(400)
    }
    
}





passport.use(new Strategy( jwtOptions, async(jwtPayload, done: Function) => {
    try{
        const user = await Login.findOne({username: jwtPayload.username});
        if(!user){
            done(null, false)
        } else {
            done(null, user)
        }
    } catch(err) {
        done(err)
    }
}))





export default commentRouter







