import { NumericFormat } from 'react-number-format';
import { ProductInputErrors } from "@/types";
import Alert from "@/components/Alert";
import InputError from "@/components/InputError";
import Image from "@/components/Image";

interface ProductFormModalProps {
    ref: React.RefObject<HTMLDialogElement|null>;
    isSuccess: boolean;
    isEditing: boolean;
    isUploading: boolean;
    errorMessage?: string;
    errors: ProductInputErrors | null;
    inputs: {
        name: string;
        description: string;
        price: string;
        category: string;
        image: string;
    };
    setters: {
        setName: (value: string) => void;
        setDescription: (value: string) => void;
        setPrice: (value: string) => void;
        setCategory: (value: string) => void;
    };
    onSubmit: (e: React.MouseEvent<HTMLButtonElement>) => void;
    onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function ProductFormModal({
    ref,
    isSuccess,
    isEditing,
    isUploading,
    errorMessage,
    errors,
    inputs,
    setters,
    onSubmit,
    onFileChange
}: ProductFormModalProps) {
    return (
        <dialog id="product_create_edit" className="modal" ref={ref}>
            <div className="modal-box">
                <form method="dialog">
                    <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                </form>
                {isSuccess ? (
                    <span className="text-xl font-bold text-success">
                        Produto {isEditing ? 'editado' : 'criado'} com sucesso!
                    </span>
                ) : (
                    <>
                        <h3 className="text-lg font-bold">{isEditing ? 'Editar' : 'Criar'} Produto</h3>
                        <form className="flex flex-col py-4">
                            {errorMessage && <Alert text={errorMessage} type="error" classes="mb-3" />}
                            <div className="flex flex-col">
                                { inputs.image && <Image src={inputs.image} alt="Imagem do Produto" width={400} height={400} />}
                                <fieldset className="fieldset">
                                    <legend className="fieldset-legend">Escolha uma imagem</legend>
                                    <input type="file" className="file-input w-full" onChange={onFileChange} disabled={isUploading} />
                                    <label className="fieldset-label">Tamanho máximo: 2MB</label>
                                </fieldset>
                                <InputError messages={errors?.image} className="mt-2"/>
                            </div>
                            <div className="flex flex-col mt-3">
                                <label className="floating-label">
                                    <span>Nome do Produto</span>
                                    <input
                                        name="name"
                                        className="input input-bordered w-full"
                                        type="text"
                                        value={inputs.name}
                                        onChange={(e) => setters.setName(e.target.value)}
                                        placeholder="Nome do produto ..."
                                        required
                                    />
                                </label>
                                <InputError messages={errors?.name} className="mt-2"/>
                            </div>

                            <div className="flex flex-col mt-3">
                                <label className="floating-label">
                                    <span>Descrição do Produto</span>
                                    <textarea
                                        name="description"
                                        className="textarea w-full"
                                        value={inputs.description}
                                        onChange={(e) => setters.setDescription(e.target.value)}
                                        placeholder="Descrição do produto ..."
                                        required
                                    />
                                </label>
                                <InputError messages={errors?.description} className="mt-2"/>
                            </div>

                            <div className="flex flex-col mt-3">
                                <label className="floating-label">
                                    <span>Preço</span>
                                    <NumericFormat
                                        className="input input-bordered w-full"
                                        value={inputs.price}
                                        onValueChange={(values) => setters.setPrice(values.value)}
                                        thousandSeparator={true}
                                        decimalScale={2}
                                        fixedDecimalScale={true}
                                        placeholder="Preço ..."
                                    />
                                </label>
                                <InputError messages={errors?.price} className="mt-2"/>
                            </div>

                            <div className="flex flex-col mt-3">
                                <label className="select w-full">
                                    <span className="label">Categoria</span>
                                    <select
                                        name="category"
                                        className="w-full"
                                        onChange={(e) => setters.setCategory(e.target.value)}
                                        value={inputs.category}
                                        required>
                                            <option value="0" disabled>Selecione uma categoria</option>
                                            <option value="1">Cosméticos</option>
                                            <option value="2">Acessórios</option>
                                            <option value="3">Eletrônico</option>
                                            <option value="4">Saúde</option>
                                            <option value="5">Roupa</option>
                                    </select>
                                </label>
                                <InputError messages={errors?.category} className="mt-2"/>
                            </div>
                        </form>
                        <div className="modal-action">
                            <button className="btn btn-success" onClick={onSubmit}>
                                {isEditing ? 'Salvar' : 'Criar'}
                            </button>
                            <form method="dialog">
                                <button className="btn">Fechar</button>
                            </form>
                        </div>
                    </>
                )}
            </div>
        </dialog>
    );
}