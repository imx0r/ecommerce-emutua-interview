import { useAuth } from "@/hooks/auth";

export default function Navigation({ user }: Readonly<{ user: any }>) {
    const { logout } = useAuth();
    
    return (
        <div className="navbar bg-base-300 shadow-sm">
            <div className="flex-1">
                <a className="btn btn-ghost text-xl" href="/">e-commerce</a>
            </div>
            <div className="flex items-baseline gap-2">
                {!user ?
                    <div className="flex-none">
                        <ul className="menu menu-horizontal px-1">
                            <li><a href="/login">Entrar</a></li>
                        </ul>
                    </div>
                    :
                    <>
                        <div className="dropdown dropdown-end">
                            <div tabIndex={0} role="button" className="btn btn-ghost">
                                Administrar
                            </div>
                            <ul
                                tabIndex={0}
                                className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow">
                                <li><a href="/administrar">Produtos</a></li>
                            </ul>
                        </div>
                        <div className="dropdown dropdown-end">
                            <div tabIndex={0} role="button" className="btn btn-neutral">
                                Olá, {user.username}!
                            </div>
                            <ul
                                tabIndex={0}
                                className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow">
                                <li><a href="#" onClick={() => logout()}>Sair</a></li>
                            </ul>
                        </div>
                    </>
                }
            </div>
        </div>
    );
}