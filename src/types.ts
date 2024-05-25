export interface ILoginCredentials {
    email: string;
    password: string;
    remember?: string;
}

export interface IUser {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
}
