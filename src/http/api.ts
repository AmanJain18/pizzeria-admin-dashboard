import {
    TCreateUser,
    ILoginCredentials,
    TUpdateUser,
    TTenantData,
} from '../types';
import api from './client';

export const AUTH_SERVICE = '/api/auth';
export const CATALOG_SERVICE = '/api/catalog';

// Auth Service
// Auth
export const login = async (credentials: ILoginCredentials) =>
    api.post(`${AUTH_SERVICE}/auth/login`, credentials);
export const self = async () => api.get(`${AUTH_SERVICE}/auth/self`);
export const logout = async () => api.post(`${AUTH_SERVICE}/auth/logout`);

// Users
export const getUsers = async (queryString: string) =>
    api.get(`${AUTH_SERVICE}/users?${queryString}`);
export const createUser = async (data: TCreateUser) =>
    api.post(`${AUTH_SERVICE}/users`, data);
export const updateUser = async (data: TUpdateUser, userId: number) =>
    api.patch(`${AUTH_SERVICE}/users/${userId}`, data);

// Tenants
export const getTenants = async (queryString: string | null = null) =>
    api.get(`${AUTH_SERVICE}/tenants${queryString ? `?${queryString}` : ''}`);
export const createTenant = async (data: TTenantData) =>
    api.post(`${AUTH_SERVICE}/tenants`, data);
export const updateTenant = async (data: TTenantData, userId: number) =>
    api.patch(`${AUTH_SERVICE}/tenants/${userId}`, data);

// Catalog Service
