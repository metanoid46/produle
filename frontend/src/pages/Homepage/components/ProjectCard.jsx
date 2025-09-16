import React from 'react';
import { Card, Button, Select, Popconfirm } from 'antd';
import ProjectSteps from './ProjectSteps';
import ProjectProgress from './ProjectProgress';
import API from '../../../API/axiosIOnstance';

const ProjectCard = ({ project, enums, messageApi, token, navigate }) => {
  const bgColor = token.colorTextBase;
  const text = token.colorBgLayout;

  // Handlers
  const handleStatusChange = async (id, value) => {
    try {
      const res = await API.put(`/projects/${id}`, { status: value });
      if (!res.data.success) messageApi.error(res.data.message || 'Failed to update status');
    } catch (err) {
      messageApi.error('Error updating status: ' + err);
    }
  };

  const handlePriorityChange = async (id, value) => {
    try {
      const res = await API.put(`/projects/${id}`, { priority: value });
      if (!res.data.success) messageApi.error(res.data.message || 'Failed to update priority');
    } catch (err) {
      messageApi.error('Error updating priority: ' + err);
    }
  };

  const deleteProject = async (id) => {
    try {
      const res = await API.delete(`/projects/${id}`);
      if (!res.data.success) messageApi.error('Failed to delete project');
    } catch (err) {
      messageApi.error('Error deleting project: ' + err);
    }
  };

  return (
    <div style={{ width: '100%' }}>
      <div style={{ display: 'flex', gap: '2rem', height: '75vh', width: '90vw', margin: '0 auto' }}>
        <Card
          title={
            <div style={{ display: 'flex', gap: '0.5vw' }}>
              <Select
                value={project.priority}
                style={{ width: 120 }}
                options={enums.priority.map((s) => ({ label: s, value: s }))}
                onChange={(val) => handlePriorityChange(project._id, val)}
              />
              <Select
                value={project.status}
                style={{ width: 120 }}
                options={enums.status.map((s) => ({ label: s, value: s }))}
                onChange={(val) => handleStatusChange(project._id, val)}
              />
            </div>
          }
          extra={
            <div style={{ display: 'flex', gap: '0.5vw' }}>
              <Button onClick={() => navigate(`/editProject/${project._id}`)} style={{ backgroundColor: bgColor, color: text }}>Edit</Button>
              <Popconfirm title="Delete project?" onConfirm={() => deleteProject(project._id)} okText="Yes" cancelText="No">
                <Button danger>Delete</Button>
              </Popconfirm>
            </div>
          }
          style={{ flex: 2, overflowY: 'auto' }}
        >
          <div style={{ marginBottom: '1rem', textAlign: 'center' }}>
            <p style={{ fontSize: '5vh', margin: 0 }}>{project.name || 'No Title'}</p>
            <div>{new Date(project.startDate).toLocaleDateString()} - {new Date(project.endDate).toLocaleDateString()}</div>
          </div>

          <ProjectSteps project={project} enums={enums} messageApi={messageApi} />
        </Card>

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <Card title="Project Description" style={{ flex: 1 }}>{project.description}</Card>
          <ProjectProgress steps={project.steps} />
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
