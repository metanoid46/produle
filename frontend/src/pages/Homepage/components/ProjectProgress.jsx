import React from 'react';
import { Card, Progress } from 'antd';

const calculateProgress = (steps = []) => {
  if (!steps.length) return { progress: 0, completed: 0, inProgress: 0, notStarted: 0 };
  const total = steps.length;
  const completed = steps.filter((s) => s.status === 'Completed').length;
  const inProgress = steps.filter((s) => s.status === 'In progress').length;
  const notStarted = steps.filter((s) => s.status === 'Not Started').length;

  return {
    progress: Math.round(((completed + inProgress / 2) / total) * 100),
    completed: Math.round((completed / total) * 100),
    inProgress: Math.round((inProgress / total) * 100),
    notStarted: Math.round((notStarted / total) * 100),
  };
};

const ProjectProgress = ({ steps }) => {
  const progress = calculateProgress(steps);

  return (
    <Card title="Project Progress" style={{ flex: 1 }}>
      <div style={{ display: 'flex', gap: '10%' }}>
        <Progress type="circle" percent={progress.progress} />
        <div style={{ flex: 1 }}>
          <div>Completed <Progress percent={progress.completed} /></div>
          <div>In Progress <Progress percent={progress.inProgress} /></div>
          <div>Not Started <Progress percent={progress.notStarted} /></div>
        </div>
      </div>
    </Card>
  );
};

export default ProjectProgress;
