import express from 'express';
import {
  createProject,
  deleteProject,
  getAllProjects,
  getEnums,
  getProjectById,
  updateProject,
  updateStepStatus
} from '../controllers/project.controller.js';
import { protectRoute } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/', protectRoute, getAllProjects); 
router.get('/project-enums', getEnums)
router.get('/:id', protectRoute, getProjectById);
router.post('/addproject', protectRoute, createProject);
router.put('/:id', protectRoute, updateProject);
router.delete('/:id', protectRoute, deleteProject);
router.put('/:projectId/steps/:stepId',protectRoute, updateStepStatus);

export default router;
