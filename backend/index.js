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
const FRONTEND_URL = process.env.BASE_FRONT || 'http://localhost:5173';

const app = express();
const server = http.createServer(app);

// === Socket.io setup ===
export const io = new Server(server, {
  cors: {
    origin: FRONTEND_URL,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  }
});

// === Middleware ===
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: FRONTEND_URL,
  credentials: true
}));

// === Root / health check route ===
app.get('/', (req, res) => res.send('Backend is running!'));
app.get('/health', (req, res) => res.json({ status: 'ok' }));

// === API routes ===
app.use('/api/projects', projectRoutes);
app.use('/api/user', userRoutes);

// === Socket.io connection ===
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

// === Start server ===
const startServer = async () => {
  await connectDB();

  // Use dynamic port for Render or default 5000
  const port = process.env.PORT || 5000;
  server.listen(port, () => {
    console.log(`Server started on port ${port}`);
  });
};

startServer();
