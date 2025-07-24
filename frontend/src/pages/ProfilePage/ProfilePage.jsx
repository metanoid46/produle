import { Button, Card, Divider, Input, message, Modal,Popconfirm } from 'antd';
import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../../API/axiosIOnstance';
import {ThemeContext} from '../../Themes/ThemeManager'
const ProfilePage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null); // Not an array
  const [loading, setLoading] = useState(false);
  const { token } = useContext(ThemeContext);
  const bg=token.colorTextBase;
  const text=token.colorBgLayout;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await API.get('/user/me');
        setUser(res.data.data);
      } catch (error) {
        console.error(error);
        message.error('Failed to load profile');
      }
    };
    fetchData();
  }, []);

  const handleChange = (e) => {
    setUser({ ...user, userName: e.target.value });
  };

  const handleConfirm = async () => {
    try {
      setLoading(true);
      
      const res = await API.put(`/user/profile/${user._id}`, { userName: user.userName });
      navigate('/home')
      message.success('Profile updated successfully');
    } catch (err) {
      console.error(err);
      message.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

 const deleteUser = async () => {
  try {
    await API.delete(`/user/delete/${user._id}`);
    message.success("Account deleted successfully");
    navigate('/login'); // or home page
  } catch (error) {
    console.error(error);
    message.error("Failed to delete account");
  }
};

 

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignContent: 'center' }}>
      <Card style={{ height: '80vh', width: '80vw' }}>
        <h1>Profile</h1>
        <Divider />
        {user && (
            <div style={{display:'flex', flexDirection:'column', gap:'1vh'}}>
          <div>
            <span>Username</span>
            <Input
              value={user.userName}
              onChange={handleChange}
              placeholder="username"
              style={{ marginTop: 4 }}
            />
          </div>
          <div>
          </div>
          </div>
            )}
           <div style={{ display: 'flex', justifyContent: 'space-between', gap: '8px', marginTop: '1rem' }}>
            <div>
                <Popconfirm
                title="Delete the task"
                description="Are you sure to delete this account?"
                onConfirm={() => deleteUser}
                onCancel={() => console.log('Cancel delete')}
                okText="Yes"
                cancelText="No"
                >
            <Button danger >Delete Account</Button>
            </Popconfirm>
        </div>
        <div style={{display:'flex',gap:'1rem'}}>
        <Button onClick={handleConfirm} loading={loading} style={{backgroundColor:bg, color:text}}>
            Confirm
        </Button>
        <Button onClick={() => navigate('/home')}>
            Cancel
        </Button>
        </div>
        </div>
      </Card>
    </div>
  );
};

export default ProfilePage;
