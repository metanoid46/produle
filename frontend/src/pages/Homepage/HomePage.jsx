import React, { useEffect, useState, useContext } from 'react';
import { Button, message, Carousel, Card } from 'antd';
import { ThemeContext } from '../../Themes/ThemeManager';
import { SocketContext } from '../../utils/SocketContext.jsx';
import API from '../../API/axiosIOnstance';
import { useNavigate } from 'react-router-dom';

import ProjectCard from './components/ProjectCard';
import EmptyProjects from './components/EmptyProjects';

const HomePage = () => {
  const navigate = useNavigate();
  const { token } = useContext(ThemeContext);
  const socket = useContext(SocketContext);
  const [messageApi, contextHolder] = message.useMessage();

  const [enums, setEnums] = useState({ status: [], priority: [], stepStatus: [] });
  const [projects, setProjects] = useState([]);

  // Fetch Projects
  const fetchProjects = async () => {
    try {
      const res = await API.get('/projects/');
      setProjects(res.data.data);
    } catch (error) {
      console.error('Failed to fetch projects: ' + error.message);
    }
  };

  // Fetch enums
  const fetchEnums = async () => {
    try {
      const res = await API.get('/projects/project-enums');
      setEnums(res.data);
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

    socket.on('projectCreated', (newProject) => {
      setProjects((prev) => [newProject, ...prev]);
      messageApi.info(`Project "${newProject.name}" created`);
    });

    socket.on('projectUpdated', (updatedProject) => {
      setProjects((prev) =>
        prev.map((p) => (p._id === updatedProject._id ? updatedProject : p))
      );
      messageApi.info(`Project "${updatedProject.name}" updated`);
    });

    socket.on('projectDeleted', ({ id }) => {
      setProjects((prev) => prev.filter((p) => p._id !== id));
      messageApi.info('A project was deleted');
    });

    socket.on('stepStatusUpdated', ({ projectId, step }) => {
      setProjects((prev) =>
        prev.map((p) =>
          p._id === projectId
            ? { ...p, steps: p.steps.map((s) => (s._id === step._id ? step : s)) }
            : p
        )
      );
      messageApi.info('Step status updated');
    });

    return () => {
      socket.off('projectCreated');
      socket.off('projectUpdated');
      socket.off('projectDeleted');
      socket.off('stepStatusUpdated');
    };
  }, [socket, messageApi]);

  return (
    <div>
      {contextHolder}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Projects</h1>
        <Button onClick={() => navigate('/addProject')}>Add Project</Button>
      </div>

      <Carousel arrows infinite>
        {projects.length > 0 ? (
          projects.map((project) => (
            <ProjectCard
              key={project._id}
              project={project}
              enums={enums}
              messageApi={messageApi}
              token={token}
              navigate={navigate}
              setProjects={setProjects}
            />
          ))
        ) : (
          <EmptyProjects />
        )}
      </Carousel>
    </div>
  );
};

export default HomePage;
