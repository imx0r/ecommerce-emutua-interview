import { numericFormatter } from 'react-number-format';
import Image from "@/components/Image";

interface ProductProps {
    name: string;
    description: string;
    price: string;
    category: string;
    image_url: string;
}

export default function ProductCard({ product }: { product: ProductProps  }) {
    return (
        <div className="indicator">
            <span className="indicator-item indicator-top indicator-center badge badge-secondary">
                {product.category}
            </span>
            <div className="card bg-base-200 w-82 shadow-sm">
                <figure style={{ aspectRatio: "1 / 1" }}>
                    <Image src={product.image_url} alt="Imagem do produto" width={400} height={400} />
                </figure>
                <div className="card-body">
                    <h2 className="card-title">{product.name}</h2>
                    <p>{product.description}</p>
                    <div className="flex flex-row justify-between items-baseline">
                        <span>R${numericFormatter(product.price, { decimalScale: 2, thousandSeparator: true })}</span>
                        <div className="card-actions justify-end mt-3">
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
}