const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const bookRoutes = require('./routes/book.routes')
const {config} = require('dotenv')
config()



// use express for middlewares
const app = express(); // parseador de bodies
app.use(bodyParser.json())

// connect databases
mongoose.connect(process.env.MONGO_URL,{dbName:process.env.MONGO_DB_NAME})
const db = mongoose.connection

app.use('/books',bookRoutes)



const port = process.env.port || 3000

app.listen(port,()=>{
    console.log(`Puerto ${port}`)
})
