import React from 'react';
import { Card, Empty } from 'antd';

const EmptyProjects = () => (
  <Card style={{ height: '65vh', width: '80vw', margin: '0 auto', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
    <Empty description="No projects at the moment" />
  </Card>
);

export default EmptyProjects;
