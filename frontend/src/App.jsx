
import React from 'react';
import { Switch, Typography } from 'antd';
import { Routes, Route } from 'react-router-dom';
import MainLayout from './Layout/MainLayout/MainLayout.jsx';
import Signup from './pages/OnboardingPage/Signup.jsx';
import Login from './pages/OnboardingPage/Login.jsx';
import HomePage from './pages/Homepage/HomePage.jsx';
import AddProjectPage from './pages/addProjectPage/AddProjectPage.jsx';
import EditProjectPage from './pages/editProjectPage/EditProjectPage.jsx';


const { Text } = Typography;

const App = () => {

  return (
      <Routes>
        <Route path="/" element={<Signup/>} />
        <Route path="/login" element={<Login/>} />

        <Route element={<MainLayout/>}>
         <Route path="/home" element={<HomePage />} />
         <Route path="/addProject" element={<AddProjectPage />} />
         <Route path="/editProject/:id" element={<EditProjectPage/>}/>
        </Route>
      </Routes>

  );
};

export default App;
