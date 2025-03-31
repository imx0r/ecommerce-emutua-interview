import useSWR from 'swr'
import axios from '@/lib/axios'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export const useAuth = ({ middleware, redirectIfAuthenticated } = {}) => {
    const router = useRouter()

    const { data: user, error, isLoading, mutate } = useSWR('/auth/me', async () => {
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

    const csrf = () => axios.get('/sanctum/csrf-cookie')

    const register = async ({ setErrors, ...props }) => {
        await csrf()

        setErrors([])

        axios
            .post('/api/v1/auth/register', props)
            .then((res) => {
                mutate()
            })
            .catch(error => {
                if (error.response.status !== 422) throw error
                setErrors(error.response.data.errors)
            })
    }

    const login = async ({ setErrors, setStatus, ...props }) => {
        await csrf()

        setErrors([])
        setStatus(null)

        axios
            .post('/api/v1/auth/login', props)
            .then((res) => {
                localStorage.setItem('token', res.data.token);
                mutate();
            })
            .catch(error => {
                if (error.response.status !== 422) throw error
                setErrors(error.response.data.errors)
            })
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