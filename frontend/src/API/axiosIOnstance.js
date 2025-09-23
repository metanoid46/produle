
import axios from 'axios';

const API = axios.create({
  baseURL:'https://produle-backend.onrender.com/api', 
  withCredentials: true,
});

export default API;
