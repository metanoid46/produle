import React, { useContext, useState } from 'react';
import { Card, Input, Button, Typography, message } from 'antd';
import { ThemeContext } from '../../Themes/ThemeManager';
import { useNavigate } from 'react-router-dom';
import API from '../../API/axiosIOnstance';
import Layout from './components/layout'; // adjust path

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
  const [resetToken, setResetToken] = useState(null);
  const [messageApi, contextHolder] = message.useMessage();

  // 1) Request code
  const handleSendCode = async () => {
    if (!email) return messageApi.error('Please enter your email');
    setLoading(true);
    try {
      await API.post('/user/forgot-password', { userMail: email });
      messageApi.success('Check your email for the verification code (including spam).');
      setStep('verify');
    } catch (err) {
      console.error(err);
      messageApi.error(err.response?.data?.message || 'Failed to send reset code');
    } finally { setLoading(false); }
  };

  // 2) Verify code -> get reset token
  const handleVerifyCode = async () => {
    if (!code) return messageApi.error('Enter the verification code');
    setLoading(true);
    try {
      const res = await API.post('/user/verify-reset-code', { userMail: email, code });
      // expected res.data.resetToken
      if (res.data.resetToken) {
        setResetToken(res.data.resetToken);
        setStep('reset');
        messageApi.success('Code verified — set a new password.');
      } else {
        // If your backend doesn't return a token and instead sets a server-side flag, just advance:
        setStep('reset');
        messageApi.success(res.data.message || 'Code verified');
      }
    } catch (err) {
      console.error(err);
      messageApi.error(err.response?.data?.message || 'Invalid or expired code');
    } finally { setLoading(false); }
  };

  // 3) Reset password
  const handleResetPassword = async () => {
    if (!newPassword || !confirmPassword) return messageApi.error('Enter both password fields');
    if (newPassword.length < 8) return messageApi.error('Password must be at least 8 characters');
    if (newPassword !== confirmPassword) return messageApi.error('Passwords do not match');

    setLoading(true);
    try {
      const payload = { newPassword, newPasswordConfirm: confirmPassword };
      // include resetToken if backend expects it
      if (resetToken) payload.resetToken = resetToken;
      else payload.userMail = email; // if backend uses session/flagging

      await API.post('/user/reset-password', payload);
      messageApi.success('Password updated. Please log in.');
      navigate('/login');
    } catch (err) {
      console.error(err);
      messageApi.error(err.response?.data?.message || 'Failed to update password');
    } finally { setLoading(false); }
  };

  // optional: resend code
  const handleResend = async () => {
    setCode('');
    setLoading(true);
    try {
      await API.post('/user/forgot-password', { userMail: email });
      messageApi.success('Verification code resent.');
    } catch (err) {
      console.error(err);
      messageApi.error('Failed to resend code');
    } finally { setLoading(false); }
  };

  return (
    <Layout>
      {contextHolder}
      <Card title="Reset Password" style={{ width: 520 }}>
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

        {step === 'verify' && (
          <>
            <Title level={4}>Enter verification code</Title>
            <Input
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="6 digit code"
              style={{ marginBottom: 12 }}
            />
            <div style={{ display: 'flex', gap: 8 }}>
              <Button type="primary" onClick={handleVerifyCode} loading={loading}>
                Verify code
              </Button>
              <Button onClick={() => setStep('email')}>Change email</Button>
              <Button onClick={handleResend}>Resend code</Button>
            </div>
          </>
        )}

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
              <Button onClick={() => navigate('/login')}>Cancel</Button>
            </div>
          </>
        )}
      </Card>
    </Layout>
  );
};

export default ForgotPassword;
