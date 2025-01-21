const express = require('express')
const userRouter = require('./userRoutes.js')
const restaurantownerRouter = require('./restaurantownerRoutes.js')
const apiRouter = express.Router()

apiRouter.use('/user', userRouter)

apiRouter.use('/restaurantowner', restaurantownerRouter)


module.exports = apiRouter