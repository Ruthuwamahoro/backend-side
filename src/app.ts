import express from 'express'
import mongoose from 'mongoose'
import bodyParser from 'body-parser';
import router from './routes/blogs'
import contact from './routes/contactMessage'
import login from './routes/login'
import projects from './routes/projects'
import userRouter from './routes/userprofile'



require('dotenv/config')
const app = express()
app.use(express.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use('/post', router)
app.use('/contact', contact)
app.use('/logininfo', login)
app.use('/project', projects)
app.use('/adminprofile', userRouter)
app.use(express.json())

mongoose.connect(process.env.DATABASE_URL!)
    .then(() => {
        console.log("connected to database")
    }).catch((error) => {
        console.log(error)
    })



mongoose.connect(process.env.CONTACTDB_URL!)
    .then(() => {
        console.log("connected to contact message database")
    })
    .catch((error)=>{
        console.log(error)
    })


mongoose.connect(process.env.LOGINDB_URL!)
    .then(() => {
        console.log("connected to login Database")
    })
    .catch((error) => {
        console.log(error)
    })


mongoose.connect(process.env.USERPROFILE_URL!)
    .then(() => {
        console.log("connected to project Database")
    })
    .catch((error) => {
        console.log(error)
    })

app.listen((8080), () => {
    console.log("Server is running on port 8080")
})