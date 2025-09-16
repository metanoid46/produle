
import axios from 'axios';

const API = axios.create({
  baseURL:'https://produle1.vercel.app/api, 
  withCredentials: true,
});

export default API;
