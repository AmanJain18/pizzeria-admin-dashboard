import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL, // Set the base URL for the API
    withCredentials: true, // Send cookies when making requests
    headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
    },
});

export default api;
