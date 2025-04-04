export default function Header({ title, actions }: Readonly<{ title: string, actions?: React.ReactNode }>) {
    return (
        <header className="bg-white">
            <div className="max-w-7xl mx-auto pt-6">
                <div className="flex flex-row justify-between items-center">
                    <h2 className="font-bold text-2xl text-gray-800 leading-tight">
                        {title}
                    </h2>
                    {actions}
                </div>
                <div className="divider"></div>
            </div>
        </header>
    );
}