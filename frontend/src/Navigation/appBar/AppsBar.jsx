import React from 'react';
import { Input} from 'antd';
import logoDark from '../../assets/logoDark.png'
import logoLight from '../../assets/logoLight.png'
import { Avatar } from "antd";
import { useContext } from 'react';
import { ThemeContext } from '../../Themes/ThemeManager';

const { Search } = Input;

const AppsBar = () => {

const onSearch=()=>{
  console.log("not found search")
}

const {token,isDarkMode}=useContext(ThemeContext);
const bgcolor=token.colorBgLayout;
  return (
    <div className="appBar" style={{width:'100%',display:'flex', alignItems:'center',justifyContent:'space-between',backgroundColor:bgcolor}}>
      <div className="logo" >
        <img src={isDarkMode ? logoDark : logoLight} alt="logo" style={{
        width:'3vw',
        height:'auto',
         objectFit: 'contain',}}/>
        
      </div>
      <div className="profile" style={{display:'flex', gap:'2vw'}}>
        <Search placeholder="Input search text" onSearch={onSearch} style={{ width: 200 }} />
        <Avatar/>
      </div>
    </div>
  );
};

export default AppsBar;
