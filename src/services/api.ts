import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080', // Altere para sua URL real
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;