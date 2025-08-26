import React, { useContext, useState } from 'react';
import { Card, Input, Button, Typography, message } from 'antd';
import { ThemeContext } from '../../Themes/ThemeManager';
import { useNavigate } from 'react-router-dom';
import API from '../../API/axiosIOnstance';
import Layout from './components/layout';

const { Title } = Typography;

const Login = () => {
  const { token } = useContext(ThemeContext);
  const navigate = useNavigate();

  const isMobile = window.innerWidth < 768;

  const [messageApi, contextHolder] = message.useMessage();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleLogin = async () => {
    try {
      const res = await API.post('/user/login', {
        userMail: formData.email,
        password: formData.password,
      });

      messageApi.success('Login successful!');
      navigate('/home');
      console.log(res.data);
    } catch (error) {
      console.error(error);
      messageApi.error(
        error?.response?.data?.message || 'Login failed. Please try again.'
      );
    }
  };

  return (
    <Layout>
      {contextHolder}
        <div
          style={{
            height: '100%',
            width: '80%',
            padding: '5vw',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '8px',
            boxShadow: 'inset 0 0 5px rgba(0,0,0,0.1)',
          }}
        >
          <Title level={2} style={{ marginBottom: '2rem' }}>
            Welcome to Produle
          </Title>
          <Input
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            style={{ marginBottom: '1rem', width: isMobile ? '100%' : '50%' }}
          />
          <Input.Password
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Password"
            style={{ marginBottom: '1rem', width: isMobile ? '100%' : '50%' }}
          />
        
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <a onClick={()=>navigate('/forgotPassword')}>Forgot Password</a>
            <Button type="primary" onClick={handleLogin}>
              Login
            </Button>
            <Button onClick={() => navigate('/')}>
              Signup
            </Button>
          </div>
        </div>
   </Layout>
  );
};

export default Login;
