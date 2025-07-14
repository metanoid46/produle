import Project from '../models/project.model.js';
import mongoose from 'mongoose'

export const getAllProjects = async (req, res) => {
  try {
    const projects = await Project.find({ user: req.user._id }).lean().sort({ createdAt: -1 });

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

    // Only return if user owns the project
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


export const createProject=async(req,res)=>{

    const project=req.body;

    if (!project.name){
        return res.status(400).json({success:false, message:'Please provide a name'});
    }
    project.user = req.user._id;
    const newProject= new Project(project);

    try{
        await newProject.save();
        res.status(201).json({success:true, message:'Data added successfully', data:newProject})
    }catch (error){
        console.error(`Error in project creation: ${error.message}`)
        res.status(500).json({success:false,message:"server Error"})
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

    res.status(200).json({ success: true, data: updatedProject });

  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};
