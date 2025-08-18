import React from 'react';
import { Select } from 'antd';
import API from '../../../API/axiosIOnstance';

const ProjectSteps = ({ project, enums, messageApi }) => {
  const handleStepStatusChange = async (projectId, stepId, status) => {
    try {
      const res = await API.put(`/projects/${projectId}/steps/${stepId}`, { status });
      if (!res.data.success) messageApi.error(res.data.message || 'Failed to update step');
    } catch (err) {
      messageApi.error('Error updating step: ' + err);
    }
  };

  return (
    <>
      <p><strong>Steps:</strong></p>
      <ul>
        {project.steps?.length > 0 ? (
          project.steps.map((step) => (
            <li key={step._id} style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '1rem' }}>
              {step.name}
              <Select
                value={step.status}
                style={{ width: 120 }}
                options={enums.stepStatus.map((s) => ({ label: s, value: s }))}
                onChange={(val) => handleStepStatusChange(project._id, step._id, val)}
              />
            </li>
          ))
        ) : <li>No steps defined.</li>}
      </ul>
    </>
  );
};

export default ProjectSteps;
