import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:3000'
});

export const getGameData = () => api.get('/dados/jogo');

export default api;