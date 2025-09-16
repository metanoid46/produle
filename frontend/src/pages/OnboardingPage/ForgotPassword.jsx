// src/pages/ForgotPassword.jsx
import React, { useState } from 'react';
import { Input, Button, Typography, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import API from '../../API/axiosIOnstance';
import Layout from './components/Layout';

const { Title } = Typography;

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState('email'); // email → code → reset
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [messageApi] = message.useMessage();

  const handleSendCode = async () => {
    if (!email) return messageApi.error("Enter your email");
    setLoading(true);
    try {
      await API.post('/user/forgot-password', { userMail: email });
      messageApi.success("Verification code sent!");
      setStep('code');
    } catch (err) {
      console.error(err);
      messageApi.error(err.response?.data?.message || "Failed to send code");
    } finally { setLoading(false); }
  };

  const handleVerifyCode = async () => {
    if (!code) return messageApi.error("Enter verification code");
    setLoading(true);
    try {
      const res = await API.post('/user/verify-reset', { userMail: email, code });
      setResetToken(res.data.resetToken);
      messageApi.success("Code verified! Set a new password.");
      setStep('reset');
    } catch (err) {
      console.error(err);
      messageApi.error(err.response?.data?.message || "Invalid code");
    } finally { setLoading(false); }
  };

  const handleResetPassword = async () => {
    if (!newPassword || !confirmPassword) return messageApi.error("Fill both password fields");
    if (newPassword.length < 8) return messageApi.error("Password must be at least 8 chars");
    if (newPassword !== confirmPassword) return messageApi.error("Passwords do not match");
    setLoading(true);
    try {
      await API.post('/user/reset-password', { userMail: email, newPassword, newPasswordConfirm: confirmPassword, resetToken });
      messageApi.success("Password updated!");
      navigate('/login');
    } catch (err) {
      console.error(err);
      messageApi.error(err.response?.data?.message || "Failed to reset password");
    } finally { setLoading(false); }
  };

  return (
    <Layout>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
        {step === 'email' && <>
          <Title level={4}>Enter your email</Title>
          <Input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" />
          <Button type="primary" onClick={handleSendCode} loading={loading}>Send Code</Button>
          <Button type="link" onClick={() => navigate('/login')}>Back to login</Button>
        </>}
        {step === 'code' && <>
          <Title level={4}>Enter Verification Code</Title>
          <Input value={code} onChange={e => setCode(e.target.value)} placeholder="Code" />
          <Button type="primary" onClick={handleVerifyCode} loading={loading}>Verify Code</Button>
          <Button type="link" onClick={() => setStep('email')}>Back</Button>
        </>}
        {step === 'reset' && <>
          <Title level={4}>Set New Password</Title>
          <Input.Password value={newPassword} onChange={e => setNewPassword(e.target.value)} placeholder="New password" />
          <Input.Password value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} placeholder="Confirm password" />
          <Button type="primary" onClick={handleResetPassword} loading={loading}>Reset Password</Button>
          <Button type="link" onClick={() => setStep('code')}>Back</Button>
        </>}
      </div>
    </Layout>
  );
};

export default ForgotPassword;
