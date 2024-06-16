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

export interface PriceConfiguration {
    [key: string]: {
        _id?: string;
        priceType: 'base' | 'additional';
        sizeOptions: string[];
    };
}

export interface Attribute {
    _id: string;
    name: string;
    widgetType: 'switch' | 'radio';
    defaultValue: string;
    options: string[];
}

export interface ICategory {
    _id: string;
    name: string;
    priceConfiguration: PriceConfiguration;
    attributes: Attribute[];
}

export type TCreateCategory = {
    name: string;
    priceConfiguration: PriceConfiguration;
    attributes: Attribute[];
};

export interface IProduct {
    _id: string;
    name: string;
    description: string;
    image: string;
    tenantId: string;
    categoryId: string;
    isPublished: boolean;
    category: ICategory;
}

export type TCreateProduct = IProduct & {
    image: {
        file: File | null;
    };
    priceConfiguration: PriceConfiguration;
    attributes: [
        {
            name: string;
            value: string | boolean;
        },
    ];
};

export type TUpdateProduct = TCreateProduct;
