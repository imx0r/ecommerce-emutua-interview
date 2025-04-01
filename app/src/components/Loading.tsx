export default function Loading({ text }: Readonly<{ text?: string }>){
    return (
        <div className="flex flex-col min-h-screen max-w-xl w-full items-center justify-center mx-auto">
            <span>{ text ?? 'Carregando ...'}</span>
        </div>
    )
}