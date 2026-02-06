import { useQuery } from '@tanstack/react-query';
import type { Product } from '../types';

interface ApiResponse {
    code: string;
    message: string;
    data: Product[];
}

const fetchProducts = async (): Promise<Product[]> => {
    const response = await fetch('/products');
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    const json: ApiResponse = await response.json();
    return json.data;
};

export const useProducts = () => {
    return useQuery({
        queryKey: ['products'],
        queryFn: fetchProducts,
        refetchInterval: 2000, // Live updates every 2s
    });
};
