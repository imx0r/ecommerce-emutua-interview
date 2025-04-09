"use client";
import { default as NextImage } from "next/image";
import { useState } from "react";

export default function Image({ src, alt, width, height, className }: { src: string, alt: string, width: number, height: number, className?: string }) {
    const [isLoading, setIsLoading] = useState(true);
    const visibility = isLoading ? 'hidden' : 'visible';
    const loader = isLoading ? 'inline-block' : 'none';

    return (
        <div
            style={{
                position: 'relative',
                width: `${width}px`,
            }}
        >
            <NextImage
                src={src}
                alt={alt}
                width={width}
                height={height}
                className={className}
                style={{ visibility }}
                onError={() => setIsLoading(false)}
                onLoad={() => setIsLoading(false)}
            />
            <span
                style={{
                    display: loader,
                    position: 'absolute',
                    top: 0
                }}
            >
                Carregando imagem ...
            </span>
        </div>
    )
}