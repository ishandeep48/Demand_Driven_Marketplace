import axios from 'axios';
import { API_BASE_URL } from './endpoints';

const api = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true, // Crucial for HTTP-only cookies
    headers: {
        'Content-Type': 'application/json',
    },
});

export default api;
