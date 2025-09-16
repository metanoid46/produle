// src/pages/VerifyPage.jsx
import React, { useState } from 'react';
import { Input, Button, Typography, message } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import API from '../../API/axiosIOnstance';
import Layout from './components/Layout';

const { Title } = Typography;

const VerifyPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const userMail = location.state?.userMail || '';
  const [code, setCode] = useState('');
  const [messageApi] = message.useMessage();

  const handleVerify = async () => {
    if (!userMail) return messageApi.error("No email found, please signup again.");
    try {
      const res = await API.post('/user/verify', { userMail, code });
      messageApi.success(res.data.message);
      navigate('/home');
    } catch (err) {
      console.error(err);
      messageApi.error(err.response?.data?.message || "Verification failed");
    }
  };

  return (
    <Layout>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
        <Title level={3}>Verify Your Email</Title>
        <Input value={code} onChange={e => setCode(e.target.value)} placeholder="Enter verification code" />
        <Button type="primary" onClick={handleVerify}>Verify</Button>
      </div>
    </Layout>
  );
};

export default VerifyPage;
