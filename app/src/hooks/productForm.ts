import { useState } from "react";
import { Product, ProductInputErrors } from "@/types";
import { productService } from "@/services/product";

interface UseProductFormProps {
    onSuccess: () => void;
    onError?: (message: string) => void;
}

export const useProductForm = ({ onSuccess, onError }: UseProductFormProps) => {
    const [id, setId] = useState<number>(0);
    const [name, setName] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [price, setPrice] = useState<string>('');
    const [category, setCategory] = useState<string>('0');
    const [image, setImage] = useState<string>('');
    const [errors, setErrors] = useState<ProductInputErrors|null>(null);
    const [isSuccess, setIsSuccess] = useState<boolean>(false);

    const resetForm = () => {
        setId(0);
        setName('');
        setDescription('');
        setPrice('');
        setCategory('0');
        setImage('');
        setErrors(null);
        setIsSuccess(false);
    };

    const setFormData = (data: Partial<Product>) => {
        setId(data.id || 0);
        setName(data.name || '');
        setDescription(data.description || '');
        setPrice(data.price || '');
        setCategory(data.category || '0');
        setImage(data.image_url || '');
    }

    const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        try {
            if (id) {
                await productService.update(id, {
                    id,
                    name,
                    description,
                    price,
                    category,
                    image_url: image
                });
            } else {
                await productService.create({
                    name,
                    description,
                    price,
                    category,
                    image_url: image
                });
            }

            setIsSuccess(true);
            onSuccess();
            setTimeout(resetForm, 2500);
        } catch (e: any) {
            if (e.response.status === 422) {
                setErrors(e.response.data.errors);
            } else {
                onError?.(e.response.data.message);
            }
        }
    }

    const handleDelete = async () => {
        try {
            await productService.delete(id);
            setIsSuccess(true);
            onSuccess();
            setTimeout(resetForm, 2500);
        } catch (e: any) {
            onError?.(e.response.data.message);
        }
    }

    return {
        inputs: { id, name, description, price, category, image },
        setters: { setId, setName, setDescription, setPrice, setCategory, setImage },
        errors,
        isSuccess,
        setFormData,
        handlers: { handleSubmit, handleDelete },
        resetForm
    }
}