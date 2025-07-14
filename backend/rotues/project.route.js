import express from 'express';
import {
  createProject,
  deleteProject,
  getAllProjects,
  getProjectById,
  updateProject
} from '../controllers/project.controller.js';
import { protectRoute } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/', protectRoute, getAllProjects); 
router.get('/:id', protectRoute, getProjectById);
router.post('/addproject', protectRoute, createProject);
router.put('/:id', protectRoute, updateProject);
router.delete('/:id', protectRoute, deleteProject);

export default router;
