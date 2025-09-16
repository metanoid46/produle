import React, { Children, useContext} from 'react';
import { Card, Input, Button, Typography, message } from 'antd';
import { ThemeContext } from '../../../Themes/ThemeManager';
import logoLight from '../../../assets/logoLight.png'
const Layout  = ({ children }) => {
    const { token } = useContext(ThemeContext);

    const backgroundColor = token.colorTextBase;


    const [contextHolder] = message.useMessage();
    return (
    <>
          <div
        style={{
            height: '100vh',
            width: '100vw',
            display: 'flex',
            backgroundColor: backgroundColor,
            flexDirection:'column',
            overflow:'hidden'
          }}
        >
  
    <div
      style={{
        
        height: '100%',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: backgroundColor,
        fontFamily: '"Pixelify Sans", sans-serif'

      }}
    >

        
      {contextHolder}
      <Card
      title={
        <img src={logoLight} alt="logo" style={{
          width:'3vw',
          height:'auto',
          padding:'1vh',
            objectFit: 'contain',}}/>
      }
        style={{
          width: '80%',
          height: '90%',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
        }}
      >
        {children}
      </Card>
      </div>
      </div>
      </>
  )
}

export default Layout