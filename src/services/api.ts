import axios from 'axios';

const api = axios.create({
  baseURL: 'https://xarotips-backend-2jqtj.ondigitalocean.app', // Altere para sua URL real
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;