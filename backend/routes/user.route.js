import express from 'express';
import { deleteUser, login, signup, updateUser, logout,me } from '../controllers/user.controller.js';
import { protectRoute } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.get('/logout', logout);
router.get('/me',protectRoute,me)
router.put('/profile/:id', protectRoute, updateUser);
router.delete('/delete/:id', protectRoute, deleteUser);

export default router;
