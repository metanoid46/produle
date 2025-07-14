import express from 'express';
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
import { connectDB } from './config/db.js';
import projectRoutes from './rotues/project.route.js'
import userRoutes from './rotues/user.route.js'
import jwt from 'jsonwebtoken'
import cors from 'cors'

dotenv.config();

const PORT=process.env.PORT;
const app=express();
const PORT_FRONT=process.env.BASE_FRONT;
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: PORT_FRONT,  
  credentials: true
}));

app.use('/api/projects',projectRoutes);
//projects Done

app.use('/api/user',userRoutes);


const createToken = (user) => {
  return jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
}

//front end needs to be created,  need timeline, progress chart  

app.listen(PORT,()=>{
    connectDB();
    console.log(`server Started at http://localhost:${PORT}`);
});
