import express from 'express'
import mongoose from 'mongoose'
import bodyParser from 'body-parser';
import router from './routes/blogs'
import contact from './routes/contactMessage'
import login from './routes/login'
import projects from './routes/projects'
import userRouter from './routes/userprofile'
import dotenv from 'dotenv'
dotenv.config()
const app = express()
app.use(express.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use('/post', router)
app.use('/contact', contact)
app.use('/logininfo', login)
app.use('/project', projects)
app.use('/adminprofile', userRouter)
app.use(express.json())
console.log(process.env.DATABASE_URL)
mongoose.connect(process.env.DATABASE_URL!)
    .then(() => {
        console.log("connected to database")
    }).catch((error) => {
        console.log(error)
    })

app.listen((8080), () => {
    console.log("Server is running on port 8080")
})