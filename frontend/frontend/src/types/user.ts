export interface User {
    userResourceId: string;
    name: string;
    username: string;
    email: string;
}

export interface UserFormData {
    name: string;
    username: string;
    email: string;
    password?: string;
    roleId?: string;
}
