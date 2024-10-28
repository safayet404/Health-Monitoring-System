const { default: mongoose } = require("mongoose")
require('dotenv').config()
const NAME = process.env.NAME
const PASS = process.env.PASSWORD

const connectDB = async ()=>{
    await mongoose.connect(process.env.MONGO_URI)
    console.log(`the db is connect with ${mongoose.connection.host}`);
    
}
module.exports = connectDB