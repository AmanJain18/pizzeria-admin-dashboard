import {
    TCreateUser,
    ILoginCredentials,
    TUpdateUser,
    TTenantData,
} from '../types';
import api from './client';

// Auth
export const login = async (credentials: ILoginCredentials) =>
    api.post('/auth/login', credentials);
export const self = async () => api.get('/auth/self');
export const logout = async () => api.post('/auth/logout');

// Users
export const getUsers = async (queryString: string) =>
    api.get(`/users?${queryString}`);
export const createUser = async (data: TCreateUser) => api.post('/users', data);
export const updateUser = async (data: TUpdateUser, userId: number) =>
    api.patch(`/users/${userId}`, data);

// Tenants
export const getTenants = async (queryString: string | null = null) =>
    api.get(`/tenants${queryString ? `?${queryString}` : ''}`);
export const createTenant = async (data: TTenantData) =>
    api.post('/tenants', data);
export const updateTenant = async (data: TTenantData, userId: number) =>
    api.patch(`/tenants/${userId}`, data);
