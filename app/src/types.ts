// user
export interface User {
    id: number;
    name: string;
    email: string;
    username: string;
    role: number;
    created_at: string|null;
    updated_at: string|null;
}

// product
export interface Product {
    id: number;
    name: string;
    description: string;
    price: string;
    image_url: string;
    category: string;
};

export interface ProductInputErrors {
    name: string[];
    description: string[];
    price: string[];
    image_url: string[];
    category: string[];
    image: string[];
};

// register
export interface RegisterInputErrors {
    name: string[];
    email: string[];
    username: string[];
    password: string[];
    password_confirmation: string[];
    alert: string[];
}

export interface RegisterFormData {
    name: string;
    username: string;
    email: string;
    password: string;
    password_confirmation: string;
}

// login
export interface LoginInputErrors {
    username: string[];
    password: string[];
    alert: string[];
}

export interface LoginFormData {
    username: string;
    password: string;
}
