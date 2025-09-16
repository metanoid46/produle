import  { useState } from 'react';
import { Input, Button, Typography, message } from 'antd';
import { useLocation, useNavigate } from 'react-router-dom';
import API from '../../API/axiosIOnstance';
import Layout from './components/Layout';

const { Title } = Typography;

const VerifyPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [code, setCode] = useState('');
  const [messageApi] = message.useMessage();
  const userMail = location.state?.userMail || '';


const handleVerify = async () => {
  if (!userMail) {
    messageApi.error("No email found, please signup again.");
    return;
  }
  
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
            <div
          style={{
            height: '100%',
            width:'80%',
            padding:'5vw',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '8px',
            boxShadow: 'inset 0 0 5px rgba(0,0,0,0.1)',
          }}
        ><Title level={3}>Verify Your Email</Title>
        <Input
          placeholder="Enter verification code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          style={{ marginBottom: '1rem' }}
        />
        <Button type="primary" onClick={handleVerify} style={{ width: '100%' }}>
          Verify
        </Button>
        </div>
        
    </Layout>
  );
};

export default VerifyPage;
