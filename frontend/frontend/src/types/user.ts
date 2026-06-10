// Este archivo proporciona los contratos TypeScript para un manejo seguro de los perfiles de usuario.
export interface User {
    userResourceId: string;
    name: string;
    username: string;
    email: string;
}

// Esta interfaz agrupa los campos solicitados durante la integración de un nuevo cliente a la plataforma.
export interface UserFormData {
    name: string;
    username: string;
    email: string;
    password?: string;
    roleId?: string;
}
