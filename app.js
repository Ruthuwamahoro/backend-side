const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const  blog = require('./routes/blogs.js')
const contact = require('./routes/contactMessage.js')
const login = require('./routes/login.js')



require('dotenv/config')
const app = express()
app.use(express.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use('/post', blog)
app.use('/contact', contact)
app.use('/logininfo', login)

mongoose.connect(process.env.DATABASE_URL, {useNewUrlParser: true})
    .then(() => {
        console.log("connected to database")
    }).catch((error) => {
        console.log(error)
    })



mongoose.connect(process.env.CONTACTDB_URL)
    .then(() => {
        console.log("connected to contact message database")
    })
    .catch((error)=>{
        console.log(error)
    })


mongoose.connect(process.env.LOGINDB_URL)
    .then(() => {
        console.log("connected to login Database")
    })
    .catch((error) => {
        console.log(error)
    })

app.listen((8080), () => {
    console.log("Server is running on port 8080")
})