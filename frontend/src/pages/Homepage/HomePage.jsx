import React, { useEffect, useState, useContext } from 'react';
import { Button, message, Carousel, Card, Select, Empty,Popconfirm } from 'antd';
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
    const interval = setInterval(fetchData, 10);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
  const fetchEnums = async () => {
    const res = await API.get('/projects/project-enums');
    setEnums(res.data);;

  };

  fetchEnums();
}, []);

    const handleStatusChange = async (id, value) => {
      try {
        const res = await API.put(`/projects/${id}`, { status: value });

        if (res.data.success) {
          messageApi.success('Project status updated successfully');
    
        } else {
          messageApi.error(res.data.message || 'Failed to update status');
        }
      } catch (error) {
        console.error('Status update failed:', error);
        messageApi.error('An error occurred while updating the status');
      }
    };


  const handlePriorityChange = async (id, value) => {
      try {
        const res = await API.put(`/projects/${id}`, { priority: value });

        if (res.data.success) {
          messageApi.success('Project status updated successfully');
    
        } else {
          messageApi.error(res.data.message || 'Failed to update status');
        }
      } catch (error) {
        console.error('Status update failed:', error);
        messageApi.error('An error occurred while updating the status');
      }
    };


        const handleStepStatuschange = async (projectId, stepId, newStatus) => {
        try {
          const res = await API.put(`/projects/${projectId}/steps/${stepId}`, { status: newStatus });

          if (res.data.success) {
            messageApi.success('Step status updated');

        
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
            messageApi.error(res.data.message || 'Failed to update step status');
          }
        } catch (error) {
          console.error('Error updating step status:', error);
          messageApi.error('Error updating step status');
        }
      };

      const deleteProject=async (id)=>{
        try{
          const res= await API.delete(`/projects/${id}`)
          if(res.data.success){
             messageApi.success('Successfully deleted the file')
          }
        }catch(err){
        messageApi.success('Error in deleting the Project')
        console.log(err)
      }
      }

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
                    <div style={{
                      display:'flex',
                      flexDirection:'row',
                      width:'100%',
                      gap:'0.5vw'
                    }}>
                      <Select
                        value={project.priority}
                        style={{ width: 120 }}
                        options={enums.priority.map((s) => ({ label: s, value: s }))}
                        onChange={(value) => handlePriorityChange(project._id, value)}
                      />
                      <Select
                        value={project.status}
                        style={{ width: 120 }}
                        options={enums.status.map((s) => ({ label: s, value: s }))}
                        onChange={(value) => handleStatusChange(project._id, value)}
                      />
                      <Button onClick={()=>navigate(`/editProject/${project._id}`)}style={{backgroundColor:bgColor, color:text}}>Edit</Button>
                      <Popconfirm
                        title="Delete the task"
                        description="Are you sure to delete this task?"
                        onConfirm={() => deleteProject(project._id)}
                        onCancel={() => console.log('Cancel delete')}
                        okText="Yes"
                        cancelText="No"
                      >
                        <Button danger>Delete</Button>
                      </Popconfirm>
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
                  <div style={{overflowY:'auto'}}>
                  <ul>
                    {project.steps?.length > 0 ? (
                      project.steps.map((step, index) => (
                        <li key={index} style={{display:'flex', flexDirection:'row', justifyContent:'space-between', paddingBottom:'1rem'}}>
                          {step.name} 
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
                  </div>
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
