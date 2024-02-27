import express, {Request, Response, NextFunction, Router} from 'express'
const commentRouter:Router = express.Router();
import Comment from '../model/commentSection'
import passport from 'passport'
import { Strategy, ExtractJwt } from 'passport-jwt';
import Login from '../model/login'
import dotenv from 'dotenv'
dotenv.config()
commentRouter.use(express.json())
commentRouter.use(passport.initialize())
commentRouter.post('/postcomment', allowUserToPostComment)


const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey : process.env.ACCESS_TOKEN_SECRET || 'heyyou'
}


async function allowUserToPostComment(req:Request, res:Response, next:NextFunction) {
    passport.authenticate('jwt', {session: false}, async(err:any, user: any , info: any) => {
        try{
            if(err){
                return (err)
            }
            if(!user){
                return res.json({status: 401, error: "please login is required"})
            }
            const newComment = new Comment ({
                commentMessage: req.body.commentMessage,
                postId: req.body.postId
            })
            await newComment.save()
            res.json({status: "ok",comment: "send successfully"})
            console.log("new com")
        } catch(err){

        }

    })(req,res,next)
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







