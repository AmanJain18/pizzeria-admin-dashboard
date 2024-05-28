export interface ILoginCredentials {
    email: string;
    password: string;
    remember?: string;
}

interface Tenant {
    id: number;
    name: string;
    address: string;
}

export interface IUser {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    tenant?: Tenant;
}
