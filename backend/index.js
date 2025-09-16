import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import http from 'http';
import { Server } from 'socket.io';
import { connectDB } from './config/db.js';
import projectRoutes from './routes/project.route.js';
import userRoutes from './routes/user.route.js';

dotenv.config();

const PORT = process.env.PORT || 5000;
const PORT_FRONT = process.env.BASE_FRONT || 'http://localhost:5173';

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

const startServer = async () => {
  await connectDB();
  server.listen(PORT, () => {
    console.log(`Server started at http://localhost:${PORT}`);
  });
};

startServer();
