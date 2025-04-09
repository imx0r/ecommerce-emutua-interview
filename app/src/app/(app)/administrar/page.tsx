'use client';

import useSWR from 'swr';
import { useState, useRef, useCallback, ChangeEvent } from 'react';
import { numericFormatter } from 'react-number-format';
import { useProductForm } from '@/hooks/productForm';
import { productService } from '@/services/product';
import { Product } from '@/types';
import Header from "@/components/Header";
import IconTrash from "@/components/icons/IconTrash";
import IconEdit from "@/components/icons/IconEdit";
import DeleteProductModal from '@/components/modals/DeleteProductModal';
import ProductFormModal from '@/components/modals/ProductFormModal';

export default function Administrar() {
    const createEditModal = useRef<HTMLDialogElement>(null);
    const trashModal = useRef<HTMLDialogElement>(null);
    
    const [errorMessage, setErrorMessage] = useState<string>('');
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [isUploading, setIsUploading] = useState<boolean>(false);

    const {
        inputs,
        setters,
        errors,
        isSuccess,
        handlers,
        setFormData,
        resetForm
    } = useProductForm({
        onSuccess: () => {
            mutate();
            setTimeout(() => {
                createEditModal?.current?.close();
                trashModal?.current?.close();
            });
        },
        onError: (message) => setErrorMessage(message)
    });
    
    const { data: products, isLoading, mutate, error } = useSWR<Product[]>(
        '/api/v1/products', 
        productService.fetchAll
    );

    const openCreateEditModal = useCallback(async (e: React.MouseEvent, productId?: number) => {
        if (createEditModal?.current) {
            if (productId) {
                setIsEditing(true);
                try {
                    const product = await productService.fetchOne(productId);
                    setFormData(product);
                } catch (error) {
                    console.error(error);
                    setErrorMessage(`Failed to fetch product details`);
                }
            } else {
                setIsEditing(false);
                resetForm();
            }

            createEditModal.current.showModal();
        }
    }, [setFormData, resetForm]);

    const openTrashModal = useCallback(async (productId: number) => {
        if (trashModal?.current) {
            setters.setId(productId);
            trashModal.current.showModal();
        }
    }, [setters]);
    
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

                setters.setImage(response.url);
                setIsUploading(false);
            }
        }
    }
    
    return (
        <>
            <Header title="Administrar Produtos" actions={<><button className="btn btn-neutral" onClick={openCreateEditModal}>Criar Produto</button></>}/>
            <div className="flex flex-col w-full gap-2">
                {isLoading || !products ? (<span>Carregando produtos ...</span>) : products.length <= 0 ? (
                    <>Não há produtos cadastrados, clica em "Criar Produto" e crie seu primeiro produto!</>
                ) :  products?.map((product: any, i: number) => {
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
            <ProductFormModal 
                ref={createEditModal} 
                isSuccess={isSuccess} 
                isEditing={isEditing} 
                isUploading={isUploading}
                inputs={inputs} 
                errors={errors} 
                setters={setters} 
                errorMessage={errorMessage}
                onSubmit={handlers.handleSubmit} 
                onFileChange={handleFileChange}
            />
            <DeleteProductModal 
                ref={trashModal} 
                isSuccess={isSuccess} 
                onDelete={handlers.handleDelete} 
            />
        </>
    );
}