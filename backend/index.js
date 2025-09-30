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

// --- Backend & frontend URLs ---
const PORT = process.env.PORT || 5000;
const FRONTEND_URL = (process.env.BASE_FRONT || "http://localhost:5173").replace(/\/$/, "");

// --- Express setup ---
const app = express();
const server = http.createServer(app);

app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: FRONTEND_URL,
  credentials: true
}));

// --- Health check route ---
app.get('/', (req, res) => res.send('Backend is running!'));
app.get('/health', (req, res) => res.json({ status: 'ok' }));

// --- API routes ---
app.use('/api/projects', projectRoutes);
app.use('/api/user', userRoutes);

// --- Socket.IO setup ---
export const io = new Server(server, {
  cors: {
    origin: FRONTEND_URL,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  }
});

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

// --- Start server ---
const startServer = async () => {
  await connectDB();
  server.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
  });
};

startServer();
