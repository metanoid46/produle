import React, { useContext,useState } from 'react';
import { Card, Input, Button, Typography , message} from 'antd';
import { ThemeContext } from '../../Themes/ThemeManager';
import { useNavigate } from 'react-router-dom';
import logoLight from '../../assets/logoLight.png'
import API from '../../API/axiosIOnstance';



const { Title } = Typography;

const Signup = () => {
    const { token } = useContext(ThemeContext);
    const navigate=useNavigate();
    const backgroundColor = token.colorTextBase;
    const isMobile = window.innerWidth < 768;
    const [messageApi, contextHolder] = message.useMessage();


    const [formData, setFormData] = useState({
    userName:'',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSignup = async () => {


    try {
      const res = await API.post('/user/signup', {
        userName: formData.userName,
        userMail: formData.email,         
        password: formData.password,
        passwordConfirm: formData.confirmPassword,
      });

       messageApi.info("Signup successful!");
       navigate('/home')
      console.log(res.data);
    } catch (err) {
      console.error(err);
       messageApi.info(err.response?.data?.message || "Signup failed");
    }
  };


  return (
    <div
    style={{
        height: '100vh',
        width: '100vw',
        display: 'flex',
        backgroundColor: backgroundColor,
        flexDirection:'column',
        overflow:'hidden'
      }}
    >
 
    <div
      style={{
        height: '100%',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: backgroundColor,
        fontFamily: '"Pixelify Sans", sans-serif'
      }}
    >
    
        {contextHolder}
      <Card
      title={
        <img src={logoLight} alt="logo" style={{
                  width:'3vw',
                  height:'auto',
                  padding:'1vh',
                    objectFit: 'contain',}}/>
      }
        style={{
          width: '80%',
          height: '90%',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
        }}
   
      >

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
        >
        <Title level={2} style={{ marginBottom: '2rem' }}>
          Welcome to Produle
        </Title>
         <Input name="userName" value={formData.userName} onChange={handleChange} placeholder="Username"  
          style={{ marginBottom: '1rem', width: isMobile ? '100%' : '50%' }} />
          <Input name="email" value={formData.email} onChange={handleChange} placeholder="Email"  
          style={{ marginBottom: '1rem', width: isMobile ? '100%' : '50%' }} />
          <Input.Password name="password" value={formData.password} onChange={handleChange} placeholder="Password" 
          style={{ marginBottom: '1rem', width: isMobile ? '100%' : '50%'}} />
          <Input.Password name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} placeholder="Confirm Password"
          style={{ marginBottom: '2rem', width: isMobile ? '100%' : '50%'}} />

          <div style={{ display: 'flex', flexDirection:'column' ,gap: '1rem' }}>
            <Button onClick={handleSignup} type="primary">Sign up</Button>
            <Button onClick={()=> navigate('/login')}>Login</Button>
          </div>
        </div>
      </Card>
    </div>
    </div>
  );
};

export default Signup;
