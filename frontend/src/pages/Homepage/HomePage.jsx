import React, { useEffect, useState, useContext } from 'react';
import { Button, message } from 'antd';
import { ThemeContext } from '../../Themes/ThemeManager';
import { SocketContext } from '../../utils/SocketContext.jsx';
import API from '../../API/axiosIOnstance';
import { useNavigate } from 'react-router-dom';

import ProjectCard from './components/ProjectCard';
import EmptyProjects from './components/EmptyProjects';

const HomePage = () => {
  const navigate = useNavigate();
  const { token } = useContext(ThemeContext) || {};
  const socket = useContext(SocketContext);
  const [messageApi, contextHolder] = message.useMessage();

  const [enums, setEnums] = useState({ status: [], priority: [], stepStatus: [] });
  const [projects, setProjects] = useState([]);

  // Fetch Projects
  const fetchProjects = async () => {
    try {
      const res = await API.get('/projects/');
      setProjects(res.data.data || []);
    } catch (error) {
      console.error('Failed to fetch projects: ' + error.message);
      messageApi.error('Failed to fetch projects');
    }
  };

  // Fetch enums
  const fetchEnums = async () => {
    try {
      const res = await API.get('/projects/project-enums');
      setEnums(res.data || { status: [], priority: [], stepStatus: [] });
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchProjects();
    fetchEnums();
  }, []);

  // Socket events
  useEffect(() => {
    if (!socket) return;

    const projectCreated = (newProject) => {
      setProjects((prev) => [newProject, ...prev]);
      messageApi.info(`Project "${newProject.name}" created`);
    };

    const projectUpdated = (updatedProject) => {
      setProjects((prev) =>
        prev.map((p) => (p._id === updatedProject._id ? updatedProject : p))
      );
      messageApi.info(`Project "${updatedProject.name}" updated`);
    };

    const projectDeleted = ({ id }) => {
      setProjects((prev) => prev.filter((p) => p._id !== id));
      messageApi.info('A project was deleted');
    };

    socket.on('projectCreated', projectCreated);
    socket.on('projectUpdated', projectUpdated);
    socket.on('projectDeleted', projectDeleted);

    return () => {
      socket.off('projectCreated', projectCreated);
      socket.off('projectUpdated', projectUpdated);
      socket.off('projectDeleted', projectDeleted);
    };
  }, [socket, messageApi]);

  return (
    <div style={{ padding: '2rem' }}>
      {contextHolder}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1>Projects</h1>
        <Button type="primary" onClick={() => navigate('/addProject')}>Add Project</Button>
      </div>

      {projects.length > 0 ? (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem', justifyContent: 'flex-start' }}>
          {projects.map((project) => (
            <div key={project._id} style={{ flex: '1 1 45%', minWidth: 300 }}>
              <ProjectCard
                project={project}
                enums={enums}
                messageApi={messageApi}
                token={token}
                navigate={navigate}
              />
            </div>
          ))}
        </div>
      ) : (
        <EmptyProjects />
      )}
    </div>
  );
};

export default HomePage;
