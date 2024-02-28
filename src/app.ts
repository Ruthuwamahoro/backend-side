import express from 'express'
import mongoose from 'mongoose'
import bodyParser from 'body-parser';
import router from './routes/blogs'
import Crouter from './routes/contactMessage'
import login from './routes/login'
import projects from './routes/projects'
import userRouter from './routes/userprofile'
import * as dotenv from 'dotenv'
import swaggerDocs from './validator/swagger';
//import commentRouter from './routes/comment'
dotenv.config()
const app = express()

app.use(bodyParser.urlencoded({ extended: true }))
app.use('/post', router)
app.use('/contact', Crouter)
app.use('/logininfo', login)
app.use('/project', projects)
app.use('/adminprofile', userRouter)
// app.use('/api', commentRouter)
app.use(express.json())
const port:number = 8080
mongoose.connect(process.env.DATABASE_URL!)
    .then(() => {
        console.log("connected to database")
    }).catch((error) => {
        console.log(error)
    })

app.listen((port), () => {
    console.log(`Server is running on port ${port}`);
    swaggerDocs(app, port);
})


export default app