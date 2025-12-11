import express from 'express'
import mongoose from 'mongoose'
import userRoutes from "./Routes/User.routes.js"
import dotenv from "dotenv"
dotenv.config()
import cookieParser from "cookie-parser"
import { Auth } from './Middlewares/auth.middleware.js'
import dataRoutes from "./Routes/Data.routes.js";
import authRoutes from "./Routes/User.routes.js"
import videoRoutes from "./Routes/Video.routes.js"
import cors from 'cors'

const app=new express();

app.use(cors({
    origin:"http://localhost:5173",
    credentials:true ,
}))
app.use(cookieParser())

app.use(express.json())

app.use("/api/user",userRoutes)

app.get("/protected",Auth,(req,res)=>{
    res.send("protected")
})

app.use("/api/data", dataRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/videos", videoRoutes);

mongoose.connect(process.env.Mongo_connect)

const Db=mongoose.connection;   //database connection

Db.on("open",()=>{
    console.log("Database is connected...") //database is successfully connected
})

Db.on("error",()=>{
    console.log("Error in connecting Database") //handle error in connecting database
})

app.listen(process.env.PORT,()=>(
    console.log(`Server is running on ${process.env.PORT}`)  //start the server 
))
 
