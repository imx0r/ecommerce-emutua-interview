'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/auth';
import { useRouter } from 'next/navigation';
import Loading from "@/app/(app)/Loading";
import InputError from "@/components/InputError";

export default function LoginPage() {
    const router = useRouter();
    
    const { login, isLoading } = useAuth({
        middleware: 'guest',
        redirectIfAuthenticated: '/'
    });
    
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState([]);
    const [status, setStatus] = useState(null);

    useEffect(() => {
        // @ts-ignore
        if (router.reset?.length > 0 && errors.length === 0) {
            // @ts-ignore
            setStatus(atob(router.reset))
        } else {
            setStatus(null)
        }
    })
    
    const handleSubmit = async (e: any) => {
        e.preventDefault();
        try {
            await login({ username, password, setErrors, setStatus });
        } catch (error) {
            console.error(`Login failed!`, error);
        }
    }
    
    if (isLoading) return (
        <Loading />
    );
    
    return (
        <div className="flex flex-col items-center justify-items-center max-w-xl w-full mx-auto">
            <form className="flex flex-col gap-1.5 w-full my-5" onSubmit={handleSubmit}>
                <label className="floating-label">
                    <span>Usuário</span>
                    <input
                        className="input input-bordered w-full"
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Usuário ..."
                        required
                    />
                </label>
                <InputError messages={errors.username} className="mt-2" />
                
                <label className="floating-label">
                    <span>Senha</span>
                    <input
                        className="input input-bordered w-full"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Senha ..."
                        required
                    />
                </label>
                <InputError messages={errors.password} className="mt-2" />
                <button type="submit" className="btn btn-success" disabled={isLoading}>Entrar</button>
                <a href="/" className="btn btn-ghost">Voltar ao Início</a>
                <div className="divider">ou</div>
                <a href="/registrar" className="btn btn-neutral">Registrar</a>
            </form>
        </div>
    );
}