'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/auth';
import { useRouter } from 'next/navigation';
import Loading from "@/components/Loading";
import InputError from "@/components/InputError";

export default function RegisterPage() {
    const router = useRouter();

    const { register, isLoading } = useAuth({
        middleware: 'guest',
        redirectIfAuthenticated: '/'
    });

    const [name, setName] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');
    const [email, setEmail] = useState('');
    const [errors, setErrors] = useState([]);
    const [status, setStatus] = useState(null);
    const [isCreating, setIsCreating] = useState(false);

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
        setIsCreating(true);
        
        try {
            await register({ data: { name, username, email, password, password_confirmation: passwordConfirmation }, setErrors, setStatus });
            setIsCreating(false);
        } catch (error) {
            console.error(`Register failed!`, error);
        }
    }

    if (isLoading) return (
        <Loading />
    );

    return (
        <div className="flex flex-col items-center justify-items-center max-w-xl w-full mx-auto p-5">
            <h2 className="text-2xl">eMutua Digital e-commerce</h2>
            <form className="flex flex-col gap-1.5 w-full my-5" onSubmit={handleSubmit}>
                <label className="floating-label">
                    <span>Nome</span>
                    <input
                        name="name"
                        className="input input-bordered w-full"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Nome ..."
                        required
                    />
                </label>
                <InputError messages={errors.name} className="mt-2" />
                
                <label className="floating-label">
                    <span>Usuário</span>
                    <input
                        name="username"
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
                    <span>E-mail</span>
                    <input
                        name="email"
                        className="input input-bordered w-full"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="E-mail ..."
                        required
                    />
                </label>
                <InputError messages={errors.email} className="mt-2" />

                <label className="floating-label">
                    <span>Senha</span>
                    <input
                        name="password"
                        className="input input-bordered w-full"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Senha ..."
                        required
                    />
                </label>
                <InputError messages={errors.password} className="mt-2" />
                
                <label className="floating-label">
                    <span>Confirme a senha</span>
                    <input
                        name="password_confirmation"
                        className="input input-bordered w-full"
                        type="password"
                        value={passwordConfirmation}
                        onChange={(e) => setPasswordConfirmation(e.target.value)}
                        placeholder="Confirme sua senha ..."
                        required
                    />
                </label>
                <InputError messages={errors.password_confirmation} className="mt-2" />
                <button type="submit" className="btn btn-success" disabled={isLoading || isCreating}>Registrar</button>
                <a href="/" className="btn btn-ghost">Voltar ao Início</a>
                <div className="divider">ou</div>
                <a href="/login" className="btn btn-neutral">Entrar</a>
            </form>
        </div>
    );
}