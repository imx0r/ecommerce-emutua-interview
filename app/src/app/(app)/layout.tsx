'use client';

import { useAuth } from "@/hooks/auth";
import Navigation from "@/app/(app)/Navigation";
import Loading from "@/components/Loading";

export default function AdminLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const { user } = useAuth({ middleware: 'auth', role: 'admin' });
    if (!user || user && user.role < 2) return (
        <Loading />
    );
    
    return (
        <div className="relative flex flex-col gap-2 max-w-5xl w-full min-h-screen mx-auto">
            <Navigation user={user} />
            <div className="flex flex-col w-full gap-2">
                {children}
            </div>
        </div>
    );
}
