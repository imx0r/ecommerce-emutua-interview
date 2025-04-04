'use client';

import useSWR from 'swr';
import { useState, useRef, ChangeEvent } from 'react';
import { NumericFormat, numericFormatter } from 'react-number-format';
import Header from "@/components/Header";
import IconTrash from "@/components/icons/IconTrash";
import IconEdit from "@/components/icons/IconEdit";
import InputError from "@/components/InputError";
import axios from "@/lib/axios";
import Alert from "@/components/Alert";
import Image from 'next/image';
import { log } from 'console';

type Errors = {
    name: string[];
    description: string[];
    price: string[];
    image_url: string[];
    category: string[];
    image: string[];
};

export default function Administrar() {
    const createEditModal = useRef<HTMLDialogElement>(null);
    const trashModal = useRef<HTMLDialogElement>(null);
    
    const [id, setId] = useState<number>(0);
    const [name, setName] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [price, setPrice] = useState<string>('');
    const [category, setCategory] = useState<string>('0');
    const [image, setImage] = useState<string>('');
    
    const [errorMessage, setErrorMessage] = useState<string>('');
    const [errors, setErrors] = useState<Errors|null>(null);
    const [isSuccess, setIsSuccess] = useState<boolean>(false);
    const [isEditing, setIsEditing] = useState<boolean>(false);
    
    const [file, setFile] = useState<File|null>(null);
    const [isUploading, setIsUploading] = useState<boolean>(false);
    
    const { data: products, isLoading, mutate, error } = useSWR('/api/v1/products', async () => {
        return axios.get('/api/v1/products')
            .then(res => res.data)
            .catch(error => {
                console.error(error);
            })
    });
    
    const openCreateEditModal = async (e: any, product_id?: any) => {
        if (createEditModal) {
            if (product_id) {
                setIsEditing(true);
                
                const res = await axios.get(`/api/v1/products/${product_id}`);
                if (res.status === 200) {
                    const data = res.data;
                    setId(data.id);
                    setName(data.name);
                    setDescription(data.description);
                    setPrice(data.price);
                    setCategory(data.category_id);
                    setImage(data.image_url);
                }
            }

            createEditModal?.current?.showModal();
        }
    }
    
    const closeCreateEditModal = () => {
        resetStateToDefault();
    }
    
    const createOrEditProduct = async () => {
        if (id && id !== 0) {
            return await onSaveProduct();
        }
        
        return await onCreateProduct();
    }
    
    const onCreateProduct = async () => {
        try {
            const token = localStorage.getItem('token');
            axios.post(`/api/v1/products`, { name, description, price, category, image_url: image }, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
                .then(res => res.data)
                .then(_ => {
                    mutate();
                    setIsSuccess(true);
                    setIsEditing(false);
                    setErrors(null);
                    setTimeout(() => {
                        resetStateToDefault();
                        createEditModal?.current?.close();
                        setIsSuccess(false);
                    }, 2000);
                })
                .catch(error => {
                    if (error.status === 400) {
                        setErrorMessage(error.response.data.message);
                    } else {
                        setErrors(error.response.data.errors);
                    }
                });
        } catch (e: any) {
            setErrors(e.response.data.errors)
        }
    }
    
    const onSaveProduct = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios
                .put(`/api/v1/products/${id}`, { name, description, price, category }, { 
                    headers: { Authorization: `Bearer ${token}`}
                });
            if (res.status === 200) {
                mutate();
                setIsSuccess(true);
                setIsEditing(false);
                setErrors(null);
                setTimeout(() => {
                    resetStateToDefault();
                    createEditModal?.current?.close();
                    setIsSuccess(false);
                }, 2000);
            }
        } catch (e: any) {
            setErrors(e.response.data.errors)
        }
    }
    
    const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files) {
            const file: File = files[0];

            setIsUploading(true);
            
            const formData = new FormData();
            formData.append('file', file);

            const request = await fetch('/api/upload', {
                method: 'POST',
                body: formData
            });
            if (request.status === 200) {
                const response = await request.json();
                console.log(response);

                setImage(response.url);
                setIsUploading(false);
            }
        }
    }
    
    const openTrashModal = (id: any) => {
        if (trashModal) {
            setId(id);
            trashModal?.current?.showModal();
        }
    }
    
    const onDeleteProduct = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.delete(`/api/v1/products/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            if (res.status === 200) {
                mutate();
                setIsSuccess(true);
                setErrors(null);
                setTimeout(() => {
                    trashModal?.current?.close();
                    setId(0);
                    setIsSuccess(false);
                }, 2000);
            }
        } catch (e: any) {
            setErrors(e.response.data.errors);
        }
    }
    
    const resetStateToDefault = () => {
        setId(0);
        setName('');
        setDescription('');
        setPrice('');
        setCategory('0');
        setImage('');
    }
    
    return (
        <>
            <Header title="Administrar Produtos" actions={<><button className="btn btn-neutral" onClick={openCreateEditModal}>Criar Produto</button></>}/>
            <div className="flex flex-col w-full gap-2">
                {isLoading ? (<span>Carregando produtos ...</span>) : products.length <= 0 ? (
                    <>Não há produtos cadastrados, clica em "Criar Produto" e crie seu primeiro produto!</>
                ) :  products.map((product: any, i: number) => {
                    return (
                        <ul className="list bg-base-200 rounded-box" key={i}>
                            <li className="list-row">
                                <div>
                                    <img className="size-10 rounded-box"
                                         src={`https://placehold.co/40x40/webp?text=${product.id}`}/>
                                </div>
                                <div>
                                    <div>{product.name}</div>
                                    <div
                                        className="text-xs uppercase font-semibold opacity-60">R${numericFormatter(product.price, { decimalScale: 2, thousandSeparator: true })} &middot; {product.category}</div>
                                </div>
                                <button className="btn btn-square btn-ghost" onClick={(e) => openCreateEditModal(e, product.id)}>
                                    <IconEdit/>
                                </button>
                                <button className="btn btn-square btn-ghost" onClick={() => openTrashModal(product.id)}>
                                    <IconTrash/>
                                </button>
                            </li>
                        </ul>
                    );
                })}
            </div>
            <dialog id="product_create_edit" className="modal" ref={createEditModal}>
                <div className="modal-box">
                    <form method="dialog">
                        <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2" onClick={closeCreateEditModal}>✕</button>
                    </form>
                    { isSuccess ? (
                        <>
                            <span className="text-xl font-bold text-success">Produto { isEditing ? 'editado' : 'criado' } com sucesso!</span>
                        </>
                    ) : (
                        <>
                            <h3 className="text-lg font-bold">{ isEditing ? 'Editar' : 'Criar' } Produto</h3>
                            <form className="flex flex-col py-4">
                                { errorMessage && <Alert text={errorMessage} type="error" classes="mb-3" /> }
                                <div className="flex flex-col">
                                    { image && <Image src={image} alt="Imagem do Produto" width="400" height="400" />}
                                    <fieldset className="fieldset">
                                        <legend className="fieldset-legend">Escolha uma imagem</legend>
                                        <input type="file" className="file-input w-full" onChange={handleFileChange} disabled={isUploading} />
                                        <label className="fieldset-label">Tamanho máximo: 2MB</label>
                                    </fieldset>
                                    <InputError messages={errors?.image} className="mt-2"/>
                                </div>
                                <div className="flex flex-col">
                                    <label className="floating-label">
                                        <span>Nome do Produto</span>
                                        <input
                                            name="name"
                                            className="input input-bordered w-full"
                                            type="text"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            placeholder="Nome do produto ..."
                                            required
                                        />
                                    </label>
                                    <InputError messages={errors?.name} className="mt-1"/>
                                </div>

                                <div className="flex flex-col">
                                    <label className="floating-label mt-3">
                                        <span>Descrição do Produto</span>
                                        <textarea
                                            name="description"
                                            className="textarea w-full"
                                            value={description}
                                            onChange={(e) => setDescription(e.target.value)}
                                            placeholder="Descrição do produto ..."
                                            required
                                        />
                                    </label>
                                    <InputError messages={errors?.description} className="mt-1"/>
                                </div>

                                <div className="flex flex-col">
                                    <label className="floating-label mt-3">
                                        <span>Preço</span>
                                        <NumericFormat
                                            className="input input-bordered w-full"
                                            value={price}
                                            onValueChange={(values) => setPrice(values.value)}
                                            thousandSeparator={true}
                                            decimalScale={2}
                                            fixedDecimalScale={true}
                                            placeholder="Preço ..."
                                        />
                                    </label>
                                    <InputError messages={errors?.price} className="mt-1"/>
                                </div>

                                <div className="flex flex-col">
                                    <label className="floating-label mt-3">
                                        <span>Categoria</span>
                                        <select
                                            name="category"
                                            className="input input-bordered w-full"
                                            onChange={(e) => setCategory(e.target.value)}
                                            value={category}
                                            required>
                                            <option value="0" disabled>Selecione uma categoria</option>
                                            <option value="1">Cosméticos</option>
                                            <option value="2">Acessórios</option>
                                            <option value="3">Eletrônico</option>
                                            <option value="4">Saúde</option>
                                            <option value="5">Roupa</option>
                                        </select>
                                    </label>
                                    <InputError messages={errors?.category} className="mt-1"/>
                                </div>
                            </form>
                            <div className="modal-action">
                                <button className="btn btn-success" onClick={createOrEditProduct} disabled={isUploading}>{isEditing ? 'Salvar' : 'Criar'}</button>
                                <form method="dialog">
                                    <button className="btn" onClick={closeCreateEditModal}>Fechar</button>
                                </form>
                            </div>
                        </>
                    )}
                </div>
            </dialog>
            <dialog id="product_edit" className="modal" ref={trashModal}>
                <div className="modal-box">
                    {isSuccess ? (
                        <>
                            <span className="text-xl font-bold text-success">Produto removido com sucesso!</span>
                        </>
                    ) : (
                        <>
                            <form method="dialog">
                                <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                            </form>
                            <h3 className="text-lg font-bold">Tem certeza que deseja deletar?</h3>
                            <p className="py-4">Esta ação não pode ser desfeita e é permanente!</p>
                            <div className="modal-action">
                                <button className="btn btn-error text-white" onClick={onDeleteProduct}>Sim, excluir!</button>
                                <form method="dialog">
                                    <button className="btn">Não, fechar</button>
                                </form>
                            </div>
                        </>
                    )}
                </div>
            </dialog>
        </>
    );
}