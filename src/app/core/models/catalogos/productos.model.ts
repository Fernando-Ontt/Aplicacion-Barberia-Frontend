export interface ProductoRequest {
    nombre: string;
    descripcion: string;
    precio: number;
    stock: number;
    estado: boolean;
    publicado: boolean;
    idCategoria: number;
    urlsMultimedia?: string[];
}

export interface ProductoResponse {
    id: number;
    nombre: string;
    descripcion: string;
    precio: number;
    stock: number;
    estado: boolean;
    publicado: boolean;
    idCategoria: number;
    nombreCategoria: string;
    urlsMultimedia: string[];
}

export interface Producto {
    id: number;
    nombre: string;
    descripcion: string;
    precio: number;
    stock: number;
    estado: boolean;
    publicado: boolean;
    idCategoria: number;
    urlsMultimedia: string[];
}

export interface ProductoFilter {
    nombre?: string;
    idCategoria?: number;
    estado?: boolean;
    publicado?: boolean;
    precioMin?: number;
    precioMax?: number;
    page?: number;
    size?: number;
    sort?: string;
}
