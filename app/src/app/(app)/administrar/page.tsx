'use client';

import useSWR from 'swr';
import Header from "@/app/(app)/Header";
import { useState, useRef } from 'react';
import IconTrash from "@/components/icons/IconTrash";
import IconEdit from "@/components/icons/IconEdit";
import InputError from "@/components/InputError";
import axios from "@/lib/axios";
import Toast from "@/components/Toast";

export default function Administrar() {
    const editModal = useRef<HTMLDialogElement>(null);
    const trashModal = useRef<HTMLDialogElement>(null);
    
    const [id, setId] = useState(0);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [category, setCategory] = useState('0');
    const [errors, setErrors] = useState([]);
    const [doneEditDelete, setDoneEditDelete] = useState(false);
    
    const { data: products, isLoading, mutate, error } = useSWR('/api/v1/products', async () => {
        return axios.get('/api/v1/products')
            .then(res => res.data)
            .catch(error => {
                console.error(error);
            })
    });
    
    const openEditModal = async (id: any) => {
        if (editModal) {
            const res = await axios.get(`/api/v1/products/${id}`);
            if (res.status === 200) {
                const data = res.data;
                setId(data.id);
                setName(data.name);
                setDescription(data.description);
                setPrice(data.price);
                setCategory(data.category_id);
                editModal?.current?.showModal();
            }
        }
    }
    
    const onSaveProduct = async () => {
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
            setDoneEditDelete(true);
            setTimeout(() => {
                editModal?.current?.close();
                setDoneEditDelete(false);
            }, 2000);
        }
    }
    
    const openTrashModal = (id: any) => {
        if (trashModal) {
            setId(id);
            trashModal?.current?.showModal();
        }
    }
    
    const onDeleteProduct = async () => {
        const token = localStorage.getItem('token');

        const res = await axios.delete(`/api/v1/products/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        if (res.status === 200) {
            mutate();
            setDoneEditDelete(true);
            setTimeout(() => {
                trashModal?.current?.close();
                setDoneEditDelete(false);
            }, 2000);
        }
    }
    
    return (
        <>
            <Header title="Administrar Produtos"/>
            <div className="flex flex-col w-full gap-2">
                {isLoading ? (<span>Carregando produtos ...</span>) : products.map((product: any, i: number) => {
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
                                        className="text-xs uppercase font-semibold opacity-60">R${product.price} &middot; {product.category}</div>
                                </div>
                                <button className="btn btn-square btn-ghost" onClick={() => openEditModal(product.id)}>
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
            <dialog id="product_edit" className="modal" ref={editModal}>
                <div className="modal-box">
                    <form method="dialog">
                        <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                    </form>
                    { doneEditDelete ? (
                        <>
                            <span className="text-xl font-bold text-success">Produto editado com sucesso!</span>
                        </>
                    ) : (
                        <>
                            <h3 className="text-lg font-bold">Alterar Produto</h3>
                            <form className="flex flex-col gap-2.5 py-4">
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

                                <label className="floating-label">
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

                                <label className="floating-label">
                                    <span>Preço</span>
                                    <input
                                        name="price"
                                        className="input input-bordered w-full"
                                        type="text"
                                        value={price}
                                        onChange={(e) => setPrice(e.target.value)}
                                        placeholder="Preço do produto ..."
                                        required
                                    />
                                </label>
                                <InputError messages={errors.price} className="mt-2"/>

                                <label className="floating-label">
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
                                <button className="btn btn-success" onClick={onSaveProduct}>Salvar</button>
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
                    {doneEditDelete ? (
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