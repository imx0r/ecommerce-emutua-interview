'use client';

import useSWR from 'swr';
import { useState } from 'react';
import { useAuth } from '@/hooks/auth'
import { numericFormatter } from 'react-number-format';
import axios from "@/lib/axios";
import Loading from "@/components/Loading";
import Navigation from "@/app/Navigation";
import Header from "@/app/Header";

export default function Home() {
    const { user, isLoading } = useAuth();

    const { data: products, error, isLoading: isLoadingProducts, mutate: mutateProducts } = useSWR('/api/v1/products', async () => {
        return axios.get('/api/v1/products')
            .then(res => res.data)
            .catch(error => {
                console.error(error);
            })
    });
    
    const [search, setSearch] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    
    const searchProduct = async (e: any) => {
        e.preventDefault();
        
        const result = await axios.get(`/api/v1/products/search?q=${search}`);
        if (result.status === 200) {
            setIsSearching(true);
            
            const data = result.data.hits.hits;
            if (result.data.hits.total.value > 0) {
                mutateProducts(data.map((e: any, i: number) => e._source), { revalidate: false });
            } else {
                mutateProducts([], { revalidate: false });
            }
        }
    }
    
    const resetProducts = async () => {
        setSearch('');
        setIsSearching(false);
        mutateProducts();
    }
    
    if (isLoading) return (
        <Loading />
    );
    
    return (
        <>
            <div className="relative flex flex-col gap-2 max-w-5xl w-full min-h-screen mx-auto">
                <Navigation user={user} />
                <div className="flex flex-col w-full gap-2">
                    <Header title="Produtos" />
                    <div className="flex flex-row items-baseline gap-2">
                        <form onSubmit={searchProduct}>
                            <div className="join my-3">
                                <label className="floating-label">
                                    <span>Buscar Produto</span>
                                    <input type="text" placeholder="Buscar ..."
                                           className="input input-bordered w-24 md:w-auto join-item"
                                           value={search}
                                           onChange={(e) => setSearch(e.target.value)}
                                           required
                                    />
                                </label>
                                <button type="submit" className="btn join-item">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none"
                                         viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                                    </svg>
                                </button>
                            </div>
                        </form>
                        { (isSearching && !isLoadingProducts) && <button className="btn btn-neutral" onClick={resetProducts}>Ver todos os produtos</button> }
                    </div>
                    <div className="flex flex-row flex-wrap w-full gap-5">
                        {isLoadingProducts ? (<span>Carregando produtos ...</span>) : products.length <= 0 ? (
                            <>Nenhum produto foi encontrado!</>
                        ) : 
                        products.map((product: any, index: number) => {
                            return (
                                <div className="indicator" key={index}>
                                    <span className="indicator-item indicator-top indicator-center badge badge-secondary">
                                        {product.category}
                                    </span>
                                    <div className="card bg-base-200 w-82 shadow-sm">
                                        <figure>
                                            <img alt="produto"
                                                 src="https://placehold.co/600x400/webp?text=Imagem+Produto"/>
                                        </figure>
                                        <div className="card-body">
                                            <h2 className="card-title">{product.name}</h2>
                                            <p>{product.description}</p>
                                            <div className="flex flex-row justify-between items-baseline">
                                                <span>R${numericFormatter(product.price, { decimalScale: 2, thousandSeparator: true })}</span>
                                                <div className="card-actions justify-end">
                                                    <button className="btn btn-success btn-sm">Comprar</button>
                                                    <button className="btn btn-neutral btn-sm">
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5"
                                                             fill="none"
                                                             viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round"
                                                                  strokeWidth="2"
                                                                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/>
                                                        </svg>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </>
    );
}
