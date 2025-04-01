'use client';

import useSWR from 'swr';
import { useState, useRef } from 'react';
import { NumericFormat, numericFormatter } from 'react-number-format';
import Header from "@/app/Header";
import IconTrash from "@/components/icons/IconTrash";
import IconEdit from "@/components/icons/IconEdit";
import InputError from "@/components/InputError";
import axios from "@/lib/axios";

export default function Administrar() {
    const createEditModal = useRef<HTMLDialogElement>(null);
    const trashModal = useRef<HTMLDialogElement>(null);
    
    const [id, setId] = useState(0);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [category, setCategory] = useState('0');
    const [errors, setErrors] = useState([]);
    const [isSuccess, setIsSuccess] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    
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
                }
            }

            createEditModal?.current?.showModal();
        }
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
            const res = await axios.post(`/api/v1/products`, {
                name,
                description,
                price,
                category
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            if (res.status === 201) {
                mutate();
                setIsSuccess(true);
                setIsEditing(false);
                setErrors([]);
                setTimeout(() => {
                    setId(0);
                    setName('');
                    setDescription('');
                    setPrice('');
                    setCategory('0');
                    createEditModal?.current?.close();
                    setIsSuccess(false);
                }, 2000);
            }
        } catch (e: any) {
            setErrors(e.response.data.errors)
        }
    }
    
    const onSaveProduct = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.put(`/api/v1/products/${id}`, {
                name,
                description,
                price,
                category
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            if (res.status === 200) {
                mutate();
                setIsSuccess(true);
                setIsEditing(false);
                setErrors([]);
                setTimeout(() => {
                    setId(0);
                    setName('');
                    setDescription('');
                    setPrice('');
                    setCategory('0');
                    createEditModal?.current?.close();
                    setIsSuccess(false);
                }, 2000);
            }
        } catch (e: any) {
            setErrors(e.response.data.errors)
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
                setErrors([]);
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
                        <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                    </form>
                    { isSuccess ? (
                        <>
                            <span className="text-xl font-bold text-success">Produto { isEditing ? 'editado' : 'criado' } com sucesso!</span>
                        </>
                    ) : (
                        <>
                            <h3 className="text-lg font-bold">{ isEditing ? 'Editar' : 'Criar' } Produto</h3>
                            <form className="flex flex-col py-4">
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
                                <InputError messages={errors.name} className="mt-2"/>

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
                                <InputError messages={errors.description} className="mt-2"/>

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
                                <InputError messages={errors.price} className="mt-2"/>

                                <label className="floating-label mt-3">
                                    <span>Categoria</span>
                                    <select
                                        name="category"
                                        className="input input-bordered w-full"
                                        onChange={(e) => setCategory(e.target.value)}
                                        value={category}
                                        required>
                                        <option value="0" disabled>Selecione uma categoria</option>
                                        <option value="1">Genérico</option>
                                        <option value="2">Mobília</option>
                                        <option value="3">Eletrônico</option>
                                        <option value="4">Saúde</option>
                                        <option value="5">Roupa</option>
                                    </select>
                                </label>
                                <InputError messages={errors.category} className="mt-2"/>
                            </form>
                            <div className="modal-action">
                                <button className="btn btn-success" onClick={createOrEditProduct}>{isEditing ? 'Salvar' : 'Criar'}</button>
                                <form method="dialog">
                                    <button className="btn">Fechar</button>
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