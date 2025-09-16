
import axios from 'axios';

const API = axios.create({
  baseURL:'produle1.vercel.app', 
  withCredentials: true,
});

export default API;
