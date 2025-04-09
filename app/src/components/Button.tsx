export default function Button({ text, color, onClick, children, isJoinItem = false }: 
    { 
        text?: string, 
        color?: string, 
        onClick?: () => void, 
        children?: React.ReactNode 
        isJoinItem?: boolean
    }
) {
  return (
    <button className={`btn ${color ?? 'btn-neutral'} ${isJoinItem && 'join-item'}`} onClick={onClick}>{text ?? children}</button>
  );
}
