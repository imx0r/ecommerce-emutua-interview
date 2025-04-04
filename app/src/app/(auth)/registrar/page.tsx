'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/auth';
import { useRouter } from 'next/navigation';
import Loading from "@/components/Loading";
import InputError from "@/components/InputError";

interface Errors {
    name: string[];
    username: string[];
    password: string[];
    password_confirmation: string[];
    email: string[];
    alert: string[];
}

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
    const [errors, setErrors] = useState<Errors|null>(null);
    const [isCreating, setIsCreating] = useState(false);

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        setIsCreating(true);
        
        try {
            await register({ data: { name, username, email, password, password_confirmation: passwordConfirmation }, setErrors });
            setIsCreating(false);
        } catch (error) {
            console.error(`Register failed!`, error);
            setIsCreating(false);
        }
    }

    if (isLoading) return (
        <Loading />
    );

    return (
        <form className="flex flex-col gap-2.5 w-full my-5" onSubmit={handleSubmit}>
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
            <InputError messages={errors?.name} />

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
            <InputError messages={errors?.username} />

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
            <InputError messages={errors?.email} />

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
            <InputError messages={errors?.password} />

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
            <InputError messages={errors?.password_confirmation} />
            <div className="flex flex-col gap-2">
                <button type="submit" className="btn btn-success" disabled={isLoading || isCreating}>{ isCreating ? 'Criando sua conta ...' : 'Registrar'}</button>
                <div className="divider">ou</div>
                <a href="/login" className="btn btn-neutral">Entrar</a>
                <a href="/" className="btn btn-ghost">Voltar ao Início</a>
            </div>
        </form>
    );
}