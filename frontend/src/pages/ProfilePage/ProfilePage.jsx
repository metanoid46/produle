import React, { useContext, useEffect, useState } from 'react';
import { Button, Card, Divider, Input, message, Popconfirm } from 'antd';
import { useNavigate } from 'react-router-dom';
import API from '../../API/axiosIOnstance';
import { ThemeContext } from '../../Themes/ThemeManager';

const ProfilePage = () => {
  const navigate = useNavigate();
  const { token } = useContext(ThemeContext);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  const bgColor = token.colorTextBase;
  const textColor = token.colorBgLayout;

  // Fetch current user
  useEffect(() => {
    const fetchUser = async () => {
      try {
       const res = await API.get('/user/me', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });

        setUser(res.data.data);
      } catch (err) {
        console.error(err);
        message.error('Failed to load profile');
      }
    };
    fetchUser();
  }, []);

  // Handle username input change
  const handleChange = (e) => {
    setUser({ ...user, userName: e.target.value });
  };

  // Confirm profile update
  const handleConfirm = async () => {
    if (!user?.userName) {
      message.error('Username cannot be empty');
      return;
    }

    try {
      setLoading(true);
      const res = await API.put(`/user/profile/${user._id}`, { userName: user.userName });

      if (res.status === 200) {
        message.success('Profile updated successfully');
        navigate('/home');
      } else {
        message.error(res.data?.message || 'Failed to update profile');
      }
    } catch (err) {
      console.error(err);
      message.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  // Delete user account
  const handleDelete = async () => {
    try {
      await API.delete(`/user/delete/${user._id}`);
      message.success('Account deleted successfully');
      navigate('/login');
    } catch (err) {
      console.error(err);
      message.error('Failed to delete account');
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '2rem' }}>
      <Card style={{ height: '80vh', width: '80vw' }}>
        <h1>Profile</h1>
        <Divider />

        {user ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <span>Username</span>
              <Input
                value={user.userName}
                onChange={handleChange}
                placeholder="Enter your username"
                style={{ marginTop: 4 }}
              />
            </div>
          </div>
        ) : (
          <p>Loading user...</p>
        )}

        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '8px', marginTop: '2rem' }}>
          <Popconfirm
            title="Delete Account"
            description="Are you sure you want to delete this account? This action cannot be undone."
            onConfirm={handleDelete}
            okText="Yes"
            cancelText="No"
          >
            <Button danger>Delete Account</Button>
          </Popconfirm>

          <div style={{ display: 'flex', gap: '1rem' }}>
            <Button onClick={handleConfirm} loading={loading} style={{ backgroundColor: bgColor, color: textColor }}>
              Confirm
            </Button>
            <Button onClick={() => navigate('/home')}>Cancel</Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ProfilePage;
