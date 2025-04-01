export default function Header({ title }: Readonly<{ title: string }>) {
    return (
        <header className="bg-white">
            <div className="max-w-7xl mx-auto pt-6">
                <h2 className="font-bold text-2xl text-gray-800 leading-tight">
                    {title}
                </h2>
                <div className="divider"></div>
            </div>
        </header>
    );
}