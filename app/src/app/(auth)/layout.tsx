import {useAuth} from "@/hooks/auth";

export default function AuthLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <div className="relative flex flex-col gap-2 max-w-5xl w-full min-h-screen mx-auto">
            {children}
        </div>
    );
}