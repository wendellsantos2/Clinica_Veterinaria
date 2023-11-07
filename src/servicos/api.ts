import axios from 'axios';

const api = axios.create({
  baseURL: 'http://192.168.0.145:7131/api', // Substitua pela URL correta do servidor
});

export default api;
