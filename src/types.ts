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
    password: string;
    role: string;
    tenantId: number | null;
};

export type TUpdateUser = {
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    tenantId: number | null;
};

export type FieldData = {
    name: string[];
    value?: string;
};

export type TTenantData = {
    name: string;
    address: string;
};

export type ICategory = {
    _id: string;
    name: string;
};
