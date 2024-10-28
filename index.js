const express = require('express')
const mongoose = require('mongoose')
require('dotenv').config()
const connectDB = require('./config/connectDB')
const bodyParser = require('body-parser')
const port = process.env.PORT || 5000
const cors = require('cors')
const morgan = require('morgan')
const { notFound, errorHandler } = require('./middleware/errorHandler')
const app = express()
app.use(bodyParser.json())
app.use(cors())
app.use(morgan("dev"))
const healthRouter = require('./routes/healthRouter')

connectDB()

app.use('/api',healthRouter)

app.use(notFound)
app.use(errorHandler)
app.listen(port,()=> console.log(`It's connected to ${port}`))