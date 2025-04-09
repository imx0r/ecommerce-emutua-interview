interface DeleteProductModalProps {
    ref: React.RefObject<HTMLDialogElement|null>;
    isSuccess: boolean;
    onDelete: () => void;
}

export default function DeleteProductModal({ ref, isSuccess, onDelete }: DeleteProductModalProps) {
    return (
        <dialog id="product_edit" className="modal" ref={ref}>
            <div className="modal-box">
                {isSuccess ? (
                    <span className="text-xl font-bold text-success">
                        Produto removido com sucesso!
                    </span>
                ) : (
                    <>
                        <form method="dialog">
                            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                        </form>
                        <h3 className="text-lg font-bold">Tem certeza que deseja deletar?</h3>
                        <p className="py-4">Esta ação não pode ser desfeita e é permanente!</p>
                        <div className="modal-action">
                            <button className="btn btn-error text-white" onClick={onDelete}>
                                Sim, excluir!
                            </button>
                            <form method="dialog">
                                <button className="btn">Não, fechar</button>
                            </form>
                        </div>
                    </>
                )}
            </div>
        </dialog>
    );
}