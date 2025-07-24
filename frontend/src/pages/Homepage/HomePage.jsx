import React, { useEffect, useState, useContext } from 'react';
import { Button, message, Carousel, Card, Select, Empty } from 'antd';
import { ThemeContext } from '../../Themes/ThemeManager';
import API from '../../API/axiosIOnstance';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const navigate = useNavigate();
  const { token } = useContext(ThemeContext);
  const [messageApi, contextHolder] = message.useMessage();
  const bgColor = token.colorTextBase;
  const text=token.colorBgLayout;
    const [enums, setEnums] = useState({
      status: [],
      priority: [],
      stepStatus: [],
    });
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await API.get('/projects/');
        setProjects(res.data.data);
      } catch (error) {
        messageApi.error('Failed to fetch projects: ' + error.message);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
  const fetchEnums = async () => {
    const res = await API.get('/projects/project-enums');
    console.log(res.data)
    setEnums(res.data);;

  };

  fetchEnums();
}, []);

    const handleStatusChange = async (id, value) => {
      try {
        const res = await API.put(`/projects/${id}`, { status: value });

        if (res.data.success) {
          message.success('Project status updated successfully');
          // Optionally, trigger a refresh or update state here
        } else {
          message.error(res.data.message || 'Failed to update status');
        }
      } catch (error) {
        console.error('Status update failed:', error);
        message.error('An error occurred while updating the status');
      }
    };

        const handleStepStatuschange = async (projectId, stepId, newStatus) => {
        try {
          const res = await API.put(`/projects/${projectId}/steps/${stepId}`, { status: newStatus });

          if (res.data.success) {
            message.success('Step status updated');

        
            setProjects((prev) =>
              prev.map((proj) =>
                proj._id === projectId
                  ? {
                      ...proj,
                      steps: proj.steps.map((step) =>
                        step._id === stepId ? { ...step, status: newStatus } : step
                      ),
                    }
                  : proj
              )
            );
          } else {
            message.error(res.data.message || 'Failed to update step status');
          }
        } catch (error) {
          console.error('Error updating step status:', error);
          message.error('Error updating step status');
        }
      };


  return (
    <div style={{ padding: '0 2rem' }}>
      {contextHolder}

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1.5rem',
        }}
      >
        <h1>Projects</h1>
        <Button  onClick={() => navigate('/addProject')}>
          Add Project
        </Button>
      </div>

      <Carousel arrows infinite style={{  padding: '2rem', borderRadius: '1rem' }}>
        {projects.length > 0 ? (
          projects.map((project) => (
            <div key={project._id} style={{ width: '100%' }}>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  gap: '2rem',
                  height: '65vh',
                  width: '90vw',
                  margin: '0 auto',
                }}
              >
                <Card
                  title={project.name}
                  extra={
                    <div>
                      <Select
                        value={project.status}
                        style={{ width: 120 }}
                        options={enums.status.map((s) => ({ label: s, value: s }))}
                        onChange={(value) => handleStatusChange(project._id, value)}
                      />
                      <Button onClick={()=>navigate(`/editProject/${project._id}`)}style={{backgroundColor:bgColor, color:text}}>Edit</Button>
                    </div>

                  }
                  style={{ flex: 2, overflowY: 'auto' }}
                >
                  <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'space-between' }}>
                    <p style={{ flex: 1 }}>{project.description || 'No description provided.'}</p>
                    <span style={{ whiteSpace: 'nowrap', marginLeft: '1rem' }}>
                      Start Date: {new Date(project.startDate).toLocaleDateString()}
                    </span>
                  </div>

                  <p><strong>Steps:</strong></p>
                  <ul>
                    {project.steps?.length > 0 ? (
                      project.steps.map((step, index) => (
                        <li key={index}>
                          {step.name} - 
                          <Select 
                            value={step.status}
                            style={{ width: 120 }}
                            options={enums.stepStatus.map((s) => ({ label: s, value: s }))}
                            onChange={(value)=>handleStepStatuschange(project._id,step._id,value)}
                          />

                        </li>
                      ))
                    ) : (
                      <li>No steps defined.</li>
                    )}
                  </ul>
                </Card>

                {/* Right - Metrics & Timeline */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <Card style={{ flex: 1 }}>
                    <p>Metrics or summary info here.</p>
                  </Card>
                  <Card style={{ flex: 1 }}>
                    <p>Timeline or task info here.</p>
                  </Card>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div style={{ width: '100%' }}>
            <Card
              style={{
                height: '65vh',
                width: '90vw',
                margin: '0 auto',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Empty description="No projects at the moment" />
              <p>Add some projects to get started.</p>
            </Card>
          </div>
        )}
      </Carousel>
    </div>
  );
};

export default HomePage;
