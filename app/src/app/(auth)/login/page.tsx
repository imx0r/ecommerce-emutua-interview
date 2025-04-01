'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/auth';
import { useRouter } from 'next/navigation';
import Loading from "@/components/Loading";
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
    const [isLogging, setIsLogging] = useState(false);

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
        setIsLogging(true);
        
        try {
            await login({ username, password, setErrors, setStatus });
            setIsLogging(false);
        } catch (error) {
            console.error(`Login failed!`, error);
        }
    }
    
    if (isLoading) return (
        <Loading />
    );
    
    return (
        <form className="flex flex-col gap-2.5 w-full my-5" onSubmit={handleSubmit}>
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
            <InputError messages={errors.username} />

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
            <InputError messages={errors.password} />
            <div className="flex flex-col gap-2">
                <button type="submit" className="btn btn-success text-white" disabled={isLoading || isLogging}>Entrar</button>
                <div className="divider">ou</div>
                <a href="/registrar" className="btn btn-neutral">Registrar</a>
                <a href="/" className="btn btn-ghost">Voltar ao Início</a>
            </div>
        </form>
    );
}