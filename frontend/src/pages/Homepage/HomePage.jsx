import React, { useContext, useEffect, useState } from 'react';
import { Button, Select, Divider, Checkbox, Flex } from 'antd';
import { ThemeContext } from '../../Themes/ThemeManager';
import API from '../../API/axiosIOnstance';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';

const { Option } = Select;

const HomePage = () => {
  const navigate = useNavigate();
  const { token } = useContext(ThemeContext);
  const background = token.colorTextSecondary;
  const color = token.colorBgLayout;

  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await API.get('/projects/');
        setProjects(res.data.data);
        if (res.data.data.length > 0) {
          setSelectedProject(res.data.data[0]); 
        }
      } catch (error) {
        console.error('Error fetching projects:', error);
      }
    };

    fetchData();
  }, []);

  const handleProjectChange = (projectId) => {
    const project = projects.find((proj) => proj._id === projectId);
    setSelectedProject(project);
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        width: '100%',
        padding: '0 5%',
        aCheckboxgnItems: 'center',
      }}
    >
      <div style={{ width: '60%', margin: '2rem 0',display: 'flex', aCheckboxgnItems:'center',flexDirection: 'row', justifyContent:'center', gap:'2vw' }}>
        <Select
          style={{ width: '100%' }}
          placeholder="Select a project"
          onChange={handleProjectChange}
          value={selectedProject?._id}
        >
          {projects.map((project) => (
            <Option key={project._id} value={project._id}>
              {project.name}
            </Option>
          ))}
        </Select>
        <Button type="primary"onClick={() => navigate('/addProject')}>
          Add Project
        </Button>
      </div>

      {selectedProject ? (
        <div
          style={{
            width: '80%',
            backgroundColor: background,
            padding: '2rem',
            borderRadius: '12px',
            boxShadow: '0 2px 12px rgba(0,0,0,0.1)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div
                    style={{
                    height: '1rem',
                    width: '1rem',
                    borderRadius: '50%',
                    backgroundColor: 'blue',
                    }}
                ></div>
                <h2 style={{ color, margin: 0 }}>{selectedProject.name}</h2>
            </div>

            <div style={{ display: 'flex', gap: '1vw' }}>
              <p style={{ color }}>{selectedProject.startDate ? dayjs(selectedProject.startDate).format('MMM D, YYYY') : 'N/A'}</p>
              <p style={{ color }}> - </p>
              <p style={{ color }}>{selectedProject.endDate ? dayjs(selectedProject.endDate).format('MMM D, YYYY') : 'N/A'}</p>
            </div>
          </div>
          <Dropdown menu={{  }} placement="bottomLeft">
                <Button>bottomLeft</Button>
            </Dropdown>
          <Divider />
          <div>
                {selectedProject.steps && selectedProject.steps.length > 0 ? (
            <div style={{ marginTop: '1rem', maxwidth:'80%',maxHeight:'50%',overflowY:'auto' }}>
              <strong style={{ color }}>Steps:</strong>
              <ul>
                {selectedProject.steps.map((step, index) => (
                  <Checkbox key={index} style={{ color ,display:'flex' }}>
                    {step.name} - {step.status}
                  </Checkbox>
                ))}
              </ul>
            </div>
          ) : (
            <p style={{ color }}>No steps available.</p>
          )}
            </div>
          <p style={{ color }}><strong>Description:</strong> {selectedProject.description || 'No description'}</p>
          <p style={{ color }}><strong>Priority:</strong> {selectedProject.priority}</p>
          <p style={{ color }}><strong>Status:</strong> {selectedProject.status}</p>
          <p style={{ color }}><strong>Created:</strong> {dayjs(selectedProject.createdAt).format('MMM D, YYYY')}</p>

          
        </div>
      ) : (
        <p style={{ color }}>No project selected.</p>
      )}

     
    </div>
  );
};

export default HomePage;
