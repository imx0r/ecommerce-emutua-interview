import useSWR from 'swr'
import axios from '@/lib/axios'

export const useAuth = ({ middleware, redirectIfAuthenticated } = {}) => {
    const { data: user, error, isLoading, mutate } = useSWR('/auth/me', async () => {
        const token = localStorage.getItem('token');
        if (token) {
            return axios
                .get('/api/v1/auth/me', { headers: { 'Authorization': `Bearer ${token}` } })
                .then(res => res.data)
                .catch(error => {
                    if (error.response.status !== 409) throw error
                });
        }
    });

    const csrf = () => axios.get('/sanctum/csrf-cookie')

    return {
        user,
        isLoading
    }
}