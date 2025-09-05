import Project, { stepSchema } from '../models/project.model.js';
import mongoose from 'mongoose';

export const getAllProjects = async (req, res) => {
  try {
    const projects = await Project.find({ user: req.user._id })
      .lean()
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: projects.length,
      data: projects
    });
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving projects',
    });
  }
};

export const getProjectById = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid project ID format'
    });
  }

  try {
    const project = await Project.findById(id).lean();

    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    if (String(project.user) !== String(req.user._id)) {
      return res.status(403).json({ success: false, message: 'Not authorized to view this project' });
    }

    res.status(200).json({ success: true, data: project });
  } catch (error) {
    console.error('Error fetching project:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while retrieving project',
    });
  }
};

export const createProject = async (req, res) => {
  const project = req.body;

  if (!project.name) {
    return res.status(400).json({ success: false, message: 'Please provide a name' });
  }
  project.user = req.user._id;
  const newProject = new Project(project);

  try {
    await newProject.save();

    req.app.get('io').emit('projectCreated', newProject);

    res.status(201).json({ success: true, message: 'Data added successfully', data: newProject });
  } catch (error) {
    console.error(`Error in project creation: ${error.message}`);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

export const deleteProject = async (req, res) => {
  const { id } = req.params;

  try {
    const project = await Project.findById(id);

    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    if (String(project.user) !== String(req.user._id)) {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this project' });
    }

    await project.deleteOne();

    req.app.get('io').emit('projectDeleted', { id });

    res.status(200).json({ success: true, message: 'Project deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const updateProject = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid project ID format'
    });
  }

  try {
    const project = await Project.findById(id);

    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    if (String(project.user) !== String(req.user._id)) {
      return res.status(403).json({ success: false, message: 'Not authorized to update this project' });
    }

    const updatedProject = await Project.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    req.app.get('io').emit('projectUpdated', updatedProject);

    res.status(200).json({ success: true, data: updatedProject });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

export const updateStepStatus = async (req, res) => {
  const { projectId, stepId } = req.params;
  const { status } = req.body;

  try {
    const project = await Project.findById(projectId);
    if (!project) return res.status(404).json({ success: false, message: 'Project not found' });

    const step = project.steps.id(stepId);
    if (!step) return res.status(404).json({ success: false, message: 'Step not found' });

    step.status = status;
    step.updatedAt = new Date();

    await project.save();


    req.app.get('io').emit('stepStatusUpdated', { projectId, step });

    res.json({ success: true, message: 'Step status updated', step });
  } catch (err) {
    console.error('Error updating step status:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const getEnums = (req, res) => {
  try {
    const statusEnum = Project.schema.path('status').enumValues;
    const priorityEnum = Project.schema.path('priority').enumValues;
    const stepStatusEnum = stepSchema.path('status').enumValues;

    res.json({
      status: statusEnum,
      priority: priorityEnum,
      stepStatus: stepStatusEnum || [],
    });
  } catch (err) {
    console.error('Error fetching enums:', err);
    res.status(500).json({ error: 'Failed to get enum values' });
  }
};
