import axios from 'axios';
import { useAuthStore } from '../store';

const api = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL, // Set the base URL for the API
    withCredentials: true, // Send cookies when making requests
    headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
    },
});

const refresh = async () => {
    await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/auth/refresh`,
        {},
        {
            withCredentials: true,
        },
    );
};

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const { logoutUser } = useAuthStore.getState();
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._isRetry) {
            originalRequest._isRetry = true;
            const headers = { ...originalRequest.headers };

            try {
                await refresh();
                return api.request({ ...originalRequest, headers });
            } catch (refreshError) {
                logoutUser();
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    },
);

export default api;
