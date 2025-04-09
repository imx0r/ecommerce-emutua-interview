import axios from "@/lib/axios";
import { Product } from "@/types";

const getAuthHeader = () => ({
    Authorization: `Bearer ${localStorage.getItem('token')}`
});

export const productService = {
    async fetchAll(): Promise<Product[]> {
        const response = await axios.get('/api/v1/products');
        return response.data;
    },

    async fetchOne(id: number): Promise<Product> {
        const response = await axios.get(`/api/v1/products/${id}`);
        return response.data;
    },

    async create(data: Partial<Product>) {
        return axios.post('/api/v1/products', data, {
            headers: getAuthHeader()
        });
    },

    async update(id: number, data: Partial<Product>) {
        return axios.put(`/api/v1/products/${id}`, data, {
            headers: getAuthHeader()
        });
    },

    async delete(id: number) {
        return axios.delete(`/api/v1/products/${id}`, {
            headers: getAuthHeader()
        });
    }
};