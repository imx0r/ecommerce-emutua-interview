export default function AuthLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <div className="relative flex flex-col gap-2 max-w-5xl w-full min-h-screen mx-auto">
            <div className="flex flex-col items-center justify-items-center max-w-xl w-full mx-auto p-5">
                <h2 className="text-2xl">eMutua Digital e-commerce</h2>
                {children}
            </div>
        </div>
    );
}