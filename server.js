const dotenv = require('dotenv');
dotenv.config("./.env")

const express = require('express')
const app = express()
var cookieParser = require('cookie-parser')
const cors = require('cors')
const mongoose = require('mongoose');

const apiRouter = require('./src/routes');

const dbpassword = process.env.DB_Password
console.log(dbpassword)
mongoose.connect(`mongodb+srv://swathykrishna2227:${dbpassword}@cluster0.8vauz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`)
.then(res => {
  console.log("DB CONNECTED")
})
.catch(err => {
  console.error("DB FAILED:", err.message)  
})
app.use(cookieParser())
app.use(express.json())
app.use('/api',apiRouter)

app.listen(3000, () => {
  console.log("server Running on http://localhost:3000")
})
      