import React from 'react';
import { Button, Input, Dropdown} from 'antd';
import logoDark from '../../assets/logoDark.png'
import logoLight from '../../assets/logoLight.png'
import { Avatar } from "antd";
import { useContext } from 'react';
import { ThemeContext } from '../../Themes/ThemeManager';
import { useNavigate } from 'react-router-dom';
import API from '../../API/axiosIOnstance';

const { Search } = Input;

const AppsBar = () => {
  const navigate=useNavigate();
    const handleLogout = async()=>{
    const res= await API.get('user/logout');
    navigate('/login');
  }
  const items=[
    {key:1,
     label:(
      <Button onClick={()=>{navigate('/profile')}}>Profile</Button>
     )
    },
     {key:2,
     label:(
      <Button danger onClick={handleLogout}>Logout</Button>
     )
    }
  ]
 

const {isDarkMode}=useContext(ThemeContext);
  return (
    <div className="appBar" style={{width:'100%',display:'flex', alignItems:'center',justifyContent:'space-between'}}>
      <div className="logo" >
        <img src={isDarkMode ? logoDark : logoLight} alt="logo" style={{
        width:'3vw',
        height:'auto',
         objectFit: 'contain',}}/>
        
      </div>
      <div className="profile" style={{display:'flex', gap:'2vw'}}>
        <Dropdown menu={{ items }} placement="bottomLeft">
         <Avatar/>
      </Dropdown>
      </div>
    </div>
  );
};

export default AppsBar;
