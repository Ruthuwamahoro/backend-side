import express, {Request, Response, NextFunction, Router} from 'express'
const commentRouter:Router = express.Router();
import Comment from '../model/commentSection'
import passport from 'passport'
import { Strategy, ExtractJwt } from 'passport-jwt';
import Login from '../model/login'
import dotenv from 'dotenv'
import postModel from '../model/postModel';
dotenv.config()
commentRouter.use(express.json())
commentRouter.use(passport.initialize())
//commentRouter.post('/postcomment', allowUserToPostComment)
commentRouter.post('/blog/:id/postcomment', allowUserToPostComment)
//commentRouter.get('/getcomment/:id', accessSingleComment)
// commentRouter.get('/blog/:id/getcomment', accessSingleComment)
commentRouter.get('/getallcomment', authenticateToSeeAllCommentIn)
commentRouter.delete('/deletecomment/:id', deleteSingleComment)


const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey : process.env.ACCESS_TOKEN_SECRET || 'heyyou'
}


// export async function allowUserToPostComment(req:Request, res:Response) {
//     try{

//         const newComment = new Comment ({
//         commentMessage: req.body.commentMessage,
//         likes: req.body.likes
//         })
//         await newComment.save()
//         res.json({status: "ok",comment: "send successfully"})
//     } catch(err){
//         console.log(err)

//     }
    
// }





export async function allowUserToPostComment (req:Request, res:Response, next: Function) {
    passport.authenticate('jwt', {session:false}, async(err:any, user:any, info:any)=>{
        try{
            if(err){
                return next(err)
            }
            if(!user){
                return res.status(400).json({status: 400, error: "invalid token"})
    
            }
            const newComment = new Comment ({
                postId: req.params.id,
                commentMessage: req.body.commentMessage, 
                username: req.body.username
                
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







