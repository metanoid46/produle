import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import { connectDB } from './config/db.js';
import projectRoutes from './routes/project.route.js';
import userRoutes from './routes/user.route.js';
import jwt from 'jsonwebtoken';
import cors from 'cors';
import http from 'http';
import { Server } from 'socket.io';
import path from 'path';



dotenv.config();

const PORT = process.env.PORT;
const PORT_FRONT = process.env.BASE_FRONT;

const app = express();
const server = http.createServer(app); 



export const io = new Server(server, {
  cors: {
    origin: PORT_FRONT,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  }
});

app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: PORT_FRONT,  
  credentials: true
}));

app.use('/api/projects', projectRoutes);
app.use('/api/user', userRoutes);

const createToken = (user) => {
  return jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
};

app.set('io', io);
io.on('connection', (socket) => {
  console.log(`Client connected: ${socket.id}`);

  socket.on('message', (data) => {
    console.log('Message received:', data);
    io.emit('message', data); 
  });

  socket.on('disconnect', () => {
    console.log(`Client disconnected: ${socket.id}`);
  });
});


const __dirname= path.resolve();
if (process.env.NODE_ENV === "production"){
   app.use(express.static(path.join(__dirname, "/frontend/dist")));

   app.get("*",(req,res)=>{
    res.sendFile(path.resolve(__dirname,"frontend","dist","index.html"))
   })

}
server.listen(PORT, () => {
  connectDB();
  console.log(`Server started at http://localhost:${PORT}`);
});
