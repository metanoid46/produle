import React, { useContext } from 'react';
import { Card, message } from 'antd';
import { ThemeContext } from '../../../Themes/ThemeManager';
import logoLight from '../../../assets/logoLight.png';

const Layout = ({ children }) => {
  const { token } = useContext(ThemeContext);
  const backgroundColor = token?.colorTextBase || '#f0f2f5';
  const [_, contextHolder] = message.useMessage();

  return (
    <div style={{ height: '100vh', width: '100vw', display: 'flex', backgroundColor, flexDirection:'column', overflow:'hidden' }}>
      {contextHolder}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: '"Pixelify Sans", sans-serif' }}>
        <Card
          title={<img src={logoLight} alt="logo" style={{ width:'3vw', height:'auto', padding:'1vh', objectFit: 'contain' }} />}
          style={{ width: '80%', height: '90%', display: 'flex', flexDirection: 'column', boxShadow: '0 4px 12px rgba(0,0,0,0.15)', overflow: 'auto' }}
        >
          {children}
        </Card>
      </div>
    </div>
  );
};

export default Layout;
