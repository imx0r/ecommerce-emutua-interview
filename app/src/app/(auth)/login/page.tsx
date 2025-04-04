'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/auth';
import Loading from "@/components/Loading";
import InputError from "@/components/InputError";
import Alert from "@/components/Alert";

interface Errors {
    username: string[];
    password: string[];
    alert: string[];
}

export default function LoginPage() {
    const { login, isLoading } = useAuth({
        middleware: 'guest',
        redirectIfAuthenticated: '/'
    });
    
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [errors, setErrors] = useState<Errors|null>();
    const [isLogging, setIsLogging] = useState<boolean>(false);

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        setIsLogging(true);
        
        try {
            await login({ username, password, setErrors });
            setIsLogging(false);
        } catch (error) {
            console.error(`Login failed!`, error);
            setIsLogging(false);
        }
    }
    
    if (isLoading) return (
        <Loading />
    );
    
    return (
        <form className="flex flex-col gap-2.5 w-full my-5" onSubmit={handleSubmit}>
            { errors?.alert && <Alert text={errors?.alert[0]} type="error" /> }
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
            <InputError messages={errors?.username} />

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
            <InputError messages={errors?.password} />
            <div className="flex flex-col gap-2">
                <button type="submit" className="btn btn-success text-white" disabled={isLoading || isLogging}>{ isLogging ? 'Entrando ...' : 'Entrar'}</button>
                <div className="divider">ou</div>
                <a href="/registrar" className="btn btn-neutral">Registrar</a>
                <a href="/" className="btn btn-ghost">Voltar ao Início</a>
            </div>
        </form>
    );
}