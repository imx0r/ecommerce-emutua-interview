'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/auth';
import { useRouter } from 'next/navigation';
import Loading from "@/app/(app)/Loading";
import ErrorContainer from "@/components/ErrorContainer";

export default function RegisterPage() {
    const router = useRouter();

    const { register, isLoading } = useAuth({
        middleware: 'guest',
        redirectIfAuthenticated: '/'
    });

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');
    const [email, setEmail] = useState('');
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
            await register({ data: { username, password, passwordConfirmation, email }, setErrors, setStatus });
        } catch (error) {
            console.error(`Register failed!`, error);
        }
    }

    if (isLoading) return (
        <Loading />
    );

    return (
        <div className="flex flex-col items-center justify-items-center max-w-xl w-full mx-auto">
            <ErrorContainer messages={errors} className="mt-2" />
            <form className="flex flex-col gap-1 w-full my-5" onSubmit={handleSubmit}>
                <input
                    className="input w-full"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Usuário ..."

                />
                <input
                    className="input w-full"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="E-mail ..."

                />
                <input
                    className="input w-full"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Senha ..."

                />
                <input
                    className="input w-full"
                    type="password"
                    value={passwordConfirmation}
                    onChange={(e) => setPasswordConfirmation(e.target.value)}
                    placeholder="Confirme sua senha ..."

                />
                <button type="submit" className="btn btn-success" disabled={isLoading}>Registrar</button>
                <a href="/" className="btn btn-ghost">Voltar ao Início</a>
                <div className="divider">ou</div>
                <a href="/login" className="btn btn-neutral">Entrar</a>
            </form>
        </div>
    );
}