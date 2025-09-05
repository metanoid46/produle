import React, { useContext, useState } from 'react';
import { Card, Input, Button, Typography, message } from 'antd';
import { ThemeContext } from '../../Themes/ThemeManager';
import { useNavigate } from 'react-router-dom';
import API from '../../API/axiosIOnstance';
import Layout from './components/layout';

const { Title } = Typography;

const ForgotPassword = () => {
  const { token } = useContext(ThemeContext);
  const navigate = useNavigate();
  const [step, setStep] = useState('email'); // 'email' | 'verify' | 'reset'
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();

  // Step 1: Request verification code
  const handleContinue = async () => {
    if (!email) return messageApi.error('Please enter your email');
    try {
      setLoading(true);
      await API.post('/user/forgot-password', { userMail: email });
      messageApi.success('Verification code sent to your email');
      setStep('verify');
    } catch (err) {
      console.error(err);
      messageApi.error(err.response?.data?.message || 'Failed to send code');
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify code
  const handleVerify = async () => {
    if (!email) {
      messageApi.error("No email found, please enter again.");
      return;
    }
    if (!code) {
      messageApi.error("Enter the verification code");
      return;
    }

    try {
      setLoading(true);
      const res = await API.post('/user/verify', { userMail: email, code });
      messageApi.success(res.data.message || 'Verified successfully');
      setStep('reset');
    } catch (err) {
      console.error(err);
      messageApi.error(err.response?.data?.message || "Verification failed");
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

    try {
      setLoading(true);
      await API.post('/user/reset-password', {
        userMail: email,
        newPassword,
        newPasswordConfirm: confirmPassword,
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
        {/* Step 1: Enter email */}
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
              <Button type="primary" onClick={handleContinue} loading={loading}>
                Continue
              </Button>
              <Button onClick={() => navigate('/login')}>Back to login</Button>
            </div>
          </>
        )}

        {/* Step 2: Enter verification code */}
        {step === 'verify' && (
          <>
            <Title level={4}>Enter verification code</Title>
            <Input
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Verification code"
              style={{ marginBottom: 12 }}
            />
            <div style={{ display: 'flex', gap: 8 }}>
              <Button type="primary" onClick={handleVerify} loading={loading}>
                Verify
              </Button>
              <Button onClick={() => setStep('email')}>Back</Button>
            </div>
          </>
        )}

        {/* Step 3: Reset password */}
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
              <Button onClick={() => setStep('verify')}>Back</Button>
            </div>
          </>
        )}
      </Card>
    </Layout>
  );
};

export default ForgotPassword;
