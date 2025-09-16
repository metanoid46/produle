// src/pages/Login.jsx
import React, { useContext, useState } from 'react';
import { Input, Button, Typography, message } from 'antd';
import { ThemeContext } from '../../Themes/ThemeManager';
import { useNavigate } from 'react-router-dom';
import API from '../../API/axiosIOnstance';
import Layout from './components/Layout';

const { Title } = Typography;

const Login = () => {
  const { token } = useContext(ThemeContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [messageApi] = message.useMessage();

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleLogin = async () => {
    if (!formData.email || !formData.password) return messageApi.error("Enter email and password");
    setLoading(true);
    try {
      const res = await API.post('/user/login', {
        userMail: formData.email,
        password: formData.password
      });
      messageApi.success("Login successful!");
      navigate('/home');
    } catch (err) {
      console.error(err);
      messageApi.error(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '80%', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
        <Title level={2}>Welcome to Produle</Title>
        <Input
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Email"
        />
        <Input.Password
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Password"
        />
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', width: '100%' }}>
          <Button type="primary" onClick={handleLogin} loading={loading}>Login</Button>
          <Button onClick={() => navigate('/')} type="default">Signup</Button>
          <Button type="link" onClick={() => navigate('/forgotPassword')}>Forgot Password?</Button>
        </div>
      </div>
    </Layout>
  );
};

export default Login;
