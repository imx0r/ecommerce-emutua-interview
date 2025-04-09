'use client';

import useSWR from 'swr';
import { useState } from 'react';
import { useAuth } from '@/hooks/auth'
import axios from "@/lib/axios";
import Loading from "@/components/Loading";
import Navigation from "@/app/Navigation";
import Header from "@/components/Header";
import ProductCard from '@/components/ProductCard';
import Button from '@/components/Button';

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
                            <Button isJoinItem={true}>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none"
                                        viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                                </svg>
                            </Button>
                        </div>
                    </form>
                    { (isSearching && !isLoadingProducts) && <Button text="Ver todos os produtos" onClick={resetProducts} /> }
                </div>
                <div className="flex flex-row flex-wrap w-full gap-5">
                    {isLoadingProducts ? (<span>Carregando produtos ...</span>) : products.length <= 0 ? (
                        <>Nenhum produto foi encontrado!</>
                    ) : 
                    products.map((product: any, index: number) => {
                        return (
                            <ProductCard key={index} product={product} />
                        );
                    })}
                </div>
            </div>
        </>
    );
}
