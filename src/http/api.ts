import { LoginCredentials } from "../types";
import api from "./client";


export const login = async (credentials: LoginCredentials) => api.post('/auth/login', credentials);