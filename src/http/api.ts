import {
    TCreateUser,
    ILoginCredentials,
    TUpdateUser,
    TTenantData,
} from '../types';
import api from './client';

export const AUTH_SERVICE = '/api/auth';
export const CATALOG_SERVICE = '/api/catalog';

//* Auth Service

//? Authentication
// Login
export const login = async (credentials: ILoginCredentials) =>
    api.post(`${AUTH_SERVICE}/auth/login`, credentials);

// Get current user
export const self = async () => api.get(`${AUTH_SERVICE}/auth/self`);

// Logout
export const logout = async () => api.post(`${AUTH_SERVICE}/auth/logout`);

//? Users
// Get all users
export const getUsers = async (queryString: string) =>
    api.get(`${AUTH_SERVICE}/users?${queryString}`);

// Create a user
export const createUser = async (data: TCreateUser) =>
    api.post(`${AUTH_SERVICE}/users`, data);

// Update a user
export const updateUser = async (data: TUpdateUser, userId: number) =>
    api.patch(`${AUTH_SERVICE}/users/${userId}`, data);

//? Tenants
// Get all tenants
export const getTenants = async (queryString: string | null = null) =>
    api.get(`${AUTH_SERVICE}/tenants${queryString ? `?${queryString}` : ''}`);

// Create a tenant
export const createTenant = async (data: TTenantData) =>
    api.post(`${AUTH_SERVICE}/tenants`, data);

// Update a tenant
export const updateTenant = async (data: TTenantData, userId: number) =>
    api.patch(`${AUTH_SERVICE}/tenants/${userId}`, data);

//* Catalog Service

//? Categories
// Get all categories
export const getCategories = async (queryString: string | null = null) =>
    api.get(
        `${CATALOG_SERVICE}/categories${queryString ? `?${queryString}` : ''}`,
    );

// Get a category

export const getCategory = async (categoryId: string) =>
    api.get(`${CATALOG_SERVICE}/categories/${categoryId}`);

//? Products
// Get all products
export const getProducts = async (queryString: string | null = null) =>
    api.get(
        `${CATALOG_SERVICE}/products${queryString ? `?${queryString}` : ''}`,
    );

// Create a product
export const createProduct = async (data: FormData) =>
    api.post(`${CATALOG_SERVICE}/products`, data, {
        headers: {
            'Content-Type': 'multipart/form-data',
            Accept: 'image/*',
        },
    });

// Update a product
export const updateProduct = async (data: FormData, productId: string) =>
    api.put(`${CATALOG_SERVICE}/products/${productId}`, data, {
        headers: {
            'Content-Type': 'multipart/form-data',
            Accept: 'image/*',
        },
    });
