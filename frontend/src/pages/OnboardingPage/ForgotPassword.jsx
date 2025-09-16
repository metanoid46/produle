import { useState } from 'react';
import { Card, Input, Button, Typography, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import API from '../../API/axiosIOnstance';
import Layout from './components/layout';

const { Title } = Typography;

const ForgotPassword = () => {
  const navigate = useNavigate();

  // Steps: email → code → reset
  const [step, setStep] = useState('email');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();

  // Step 1: Send reset email
  const handleSendCode = async () => {
    if (!email) return messageApi.error('Please enter your email');
    setLoading(true);
    try {
      await API.post('/user/forgot-password', { userMail: email },{
        withCredentials:false
      });
      messageApi.success('Verification code sent to your email');
      setStep('code');
    } catch (err) {
      console.error(err);
      messageApi.error(err.response?.data?.message || 'Failed to send reset code');
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify reset code
  const handleVerifyCode = async () => {
    if (!code) return messageApi.error('Enter the verification code');
    setLoading(true);
    try {
      const res = await API.post('/user/verify-reset', { userMail: email, code },{
        withCredentials:false
      });
      messageApi.success('Code verified! Please set a new password');
      setResetToken(res.data.resetToken);
      setStep('reset');
    } catch (err) {
      console.error(err);
      messageApi.error(err.response?.data?.message || 'Invalid or expired code');
    } finally {
      setLoading(false);
    }
  };

  // Step 3: Reset password
  const handleResetPassword = async () => {
    if (!newPassword || !confirmPassword) {
      return messageApi.error('Enter both password fields');
    }
    if (newPassword.length < 8) {
      return messageApi.error('Password must be at least 8 characters');
    }
    if (newPassword !== confirmPassword) {
      return messageApi.error('Passwords do not match');
    }

    setLoading(true);
    try {
      await API.post('/user/reset-password', {
        userMail: email,
        newPassword,
        newPasswordConfirm: confirmPassword,
        resetToken, // backend can validate purpose = password_reset
      });
      messageApi.success('Password updated. Please log in.');
      navigate('/login');
    } catch (err) {
      console.error(err);
      messageApi.error(err.response?.data?.message || 'Failed to update password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      {contextHolder}
      <Card title="Reset Password" style={{ width: 520 }}>
        {/* Step 1: Email */}
        {step === 'email' && (
          <>
            <Title level={4}>Enter your email</Title>
            <Input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              style={{ marginBottom: 12 }}
            />
            <div style={{ display: 'flex', gap: 8 }}>
              <Button type="primary" onClick={handleSendCode} loading={loading}>
                Send code
              </Button>
              <Button onClick={() => navigate('/login')}>Back to login</Button>
            </div>
          </>
        )}

        {/* Step 2: Code */}
        {step === 'code' && (
          <>
            <Title level={4}>Enter the verification code</Title>
            <Input
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Verification code"
              style={{ marginBottom: 12 }}
            />
            <div style={{ display: 'flex', gap: 8 }}>
              <Button type="primary" onClick={handleVerifyCode} loading={loading}>
                Verify code
              </Button>
              <Button onClick={() => setStep('email')}>Back</Button>
            </div>
          </>
        )}

        {/* Step 3: Reset */}
        {step === 'reset' && (
          <>
            <Title level={4}>Set a new password</Title>
            <Input.Password
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="New password"
              style={{ marginBottom: 12 }}
            />
            <Input.Password
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
              style={{ marginBottom: 12 }}
            />
            <div style={{ display: 'flex', gap: 8 }}>
              <Button type="primary" onClick={handleResetPassword} loading={loading}>
                Reset password
              </Button>
              <Button onClick={() => setStep('code')}>Back</Button>
            </div>
          </>
        )}
      </Card>
    </Layout>
  );
};

export default ForgotPassword;
