export interface ILoginCredentials {
    email: string;
    password: string;
    remember?: string;
}

export interface ITenant {
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
    tenant?: ITenant;
}

export type TCreateUser = {
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    tenantId: number;
};

export type FieldData = {
    name: string[];
    value?: string;
    errors?: string[];
};
