import useSWR from 'swr'
import axios from '@/lib/axios'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { LoginFormData, RegisterFormData, User } from '@/types';

type AuthRole = 'admin' | 'user' | 'guest';
type MiddlewareType = 'guest' | 'auth' | null;

export const useAuth = ({ middleware, redirectIfAuthenticated, role }: 
    { middleware?: MiddlewareType, redirectIfAuthenticated?: string, role?: AuthRole } = { middleware: 'guest', role: 'guest' }
) => {
    const router = useRouter()

    const { data: user, error, isLoading, mutate } = useSWR<User>('/auth/me', async () => {
        const token = localStorage.getItem('token');
        if (token) {
            return axios
                .get('/api/v1/auth/me', { headers: { 'Authorization': `Bearer ${token}` } })
                .then(res => res.data)
                .catch(error => {
                    if (error.response.status !== 409) throw error
                });
        } else {
            return null;
        }
    });

    const csrf = () => axios.get('/sanctum/csrf-cookie');

    const register = async ({ data, setErrors }: { setErrors: any, data: RegisterFormData }) => {
        await csrf()

        setErrors([])

        axios
            .post('/api/v1/auth/register', { data: data })
            .then((res) => {
                localStorage.setItem('token', res.data.token)
                mutate()
            })
            .catch(error => {
                if (error.response.status !== 422) throw error
                setErrors(error.response.data.errors)
            })
    }

    const login = async ({ data, setErrors }: { data: LoginFormData, setErrors: any }) => {
        await csrf();
        setErrors([]);
        
        axios
            .post('/api/v1/auth/login', data)
            .then((res) => {
                localStorage.setItem('token', res.data.token);
                mutate();
                router.push('/');
            })
            .catch(error => {
                if (error.response.status !== 422) throw error
                setErrors(error.response.data.errors);
            });
    }

    const logout = async () => {
        if (!user) {
            return;
        }

        if (!error) {
            const token = localStorage.getItem('token');
            await axios.post('/api/v1/auth/logout', {}, { headers: { 'Authorization': `Bearer ${token}` }}).then(() => {
                localStorage.removeItem('token');
                mutate()
            });
            
            router.push('/');
        }
    }

    useEffect(() => {
        if (middleware === 'guest' && redirectIfAuthenticated && user)
            router.push(redirectIfAuthenticated)
        
        if (middleware === 'auth' && role === 'admin' && user && user.role < 2)
            router.push('/');

        if (middleware === 'auth' && error) logout()
    }, [user, error])

    return {
        user,
        register,
        login,
        logout,
        isLoading
    }
}