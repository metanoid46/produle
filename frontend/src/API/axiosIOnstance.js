
import axios from 'axios';

const API = axios.create({
  baseURL:'https://produlebackend.vercel.app/api', 
  withCredentials: true,
});

export default API;
