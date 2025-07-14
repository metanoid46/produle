
import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import AppsBar from '../../Navigation/appBar/AppsBar';
import { Switch } from 'antd';
import { Outlet } from 'react-router-dom';
import { ThemeContext } from '../../Themes/ThemeManager'; 

const MainLayout = () => {
  const { isDarkMode, setIsDarkMode, token } = useContext(ThemeContext);

  return (
    <div className="main-layout" style={{    background: token.colorBgLayout,
        color: token.colorTextBase,
        height: '100vh',
        width: '100vw',
        padding:0,
        margin: 0,
        display: 'flex',
        flexDirection: 'column',
        transition: 'all 0.2s ease-in',
        }}>
      <header style={{
          display: 'flex',
          alignItems:'center',
          justifyContent: 'space-between',
          padding: '1vw',
          gap: '2vw',
          flexShrink: 0, 
        }}>
        
        <AppsBar />
        <Switch checked={isDarkMode} onChange={() => setIsDarkMode(!isDarkMode)} />
      </header>
      <main style={{
          flex: 1,
          overflowY: 'auto',
          padding: '1rem',
        }}>
         <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;
