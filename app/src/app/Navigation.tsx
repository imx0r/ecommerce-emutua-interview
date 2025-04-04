import { useAuth } from "@/hooks/auth";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Loading from "@/components/Loading";

export default function Navigation({ user }: Readonly<{ user: any }>) {
    const { logout } = useAuth();
    const router = useRouter();
    
    const [loggingOut, setLoggingOut] = useState(false);
    
    const handleLogout = async (e: any) => {
        e.preventDefault();
        
        setLoggingOut(true);
        await logout();
        setLoggingOut(false);
    }
    
    if (loggingOut) return (
        <Loading text="Saindo, aguarde ..." />
    );
    
    return (
        <div className="navbar bg-base-300 shadow-sm">
            <div className="flex-1">
                <a className="btn btn-ghost text-xl" href="/">eMutua Digital e-commerce</a>
            </div>
            <div className="flex items-baseline gap-2">
                {!user ?
                    <div className="flex-none">
                        <ul className="menu menu-horizontal px-1">
                            <li><Link href="/login">Entrar</Link></li>
                            <li><Link href="/registrar">Registrar</Link></li>
                        </ul>
                    </div>
                    :
                    <>
                        { user.role === 2 && (
                            <div className="dropdown dropdown-end">
                                <div tabIndex={0} role="button" className="btn btn-ghost">
                                    Administrar
                                </div>
                                <ul
                                    tabIndex={0}
                                    className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow">
                                    <li><Link href="/administrar">Produtos</Link></li>
                                </ul>
                            </div>
                        ) }
                        <div className="dropdown dropdown-end">
                            <div tabIndex={0} role="button" className="btn btn-neutral">
                                Olá, {user.name}!
                            </div>
                            <ul
                                tabIndex={0}
                                className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow">
                                <li><a href="#" onClick={handleLogout}>Sair</a></li>
                            </ul>
                        </div>
                    </>
                }
            </div>
        </div>
    );
}