import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import api from '../api/axios';
import { ENDPOINTS } from '../api/endpoints';
import { Zap, ShoppingCart, ArrowLeft, Loader2 } from 'lucide-react';
import type { Product } from '../types';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const formatINR = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0,
    }).format(price * 83);
};

const ProductDetails = () => {
    const { id } = useParams<{ id: string }>();
    // console.log('id is ',id)
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();

    // In a real scenario, we might want a specific endpoint for single product.
    // The instructions say: Endpoint: GET /products/:id
    // But if that doesn't exist, we might fall back to client-side filter if needed.
    // But the prompt explicitly said "Create a dynamic route /product/:id. Endpoint: GET /products/:id".
    // So we assume the API supports it.

    const { data: product, isLoading, error } = useQuery({
        queryKey: ['product', id],
        queryFn: async () => {
            // The prompt says GET /products/:id
            const response = await api.get<{ data: Product }>(ENDPOINTS.PRODUCT_DETAILS(id!));
            // Note: Adjust based on actual API response structure. 
            // In useProducts.ts, it was res.json().data. 
            // Here we assume similar wrapper.
            // If the API endpoint /products/:id doesn't exist yet (since I can't touch backend),
            // I might have an issue. 
            // WAITING: The user prompt says "Constraint: DO NOT touch the backend code. You must strictly adhere to the existing API endpoints and data structures defined below."
            // And listed: Endpoint: GET /products/:id
            // So I must assume it exists.
            return response.data.data; // Assuming wrapper { code, message, data: { ... } }
        },
        enabled: !!id,
    });

    const handleBuyNow = () => {
        if (!isAuthenticated) {
            toast.error('Please login to purchase');
            navigate('/login');
            return;
        }
        navigate(`/checkout/${id}`);
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-[60vh]">
                <Loader2 className="animate-spin text-primary w-12 h-12" />
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className="text-center py-20">
                <h2 className="text-2xl font-bold text-zinc-500">Product Not Found</h2>
                <button onClick={() => navigate('/')} className="mt-4 text-primary hover:underline">
                    Back to Marketplace
                </button>
            </div>
        );
    }

    const isSurge = product.currentPrice > product.basePrice;

    return (
        <div className="max-w-7xl mx-auto px-6 py-10">
            <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-zinc-400 hover:text-white mb-8 transition-colors">
                <ArrowLeft size={18} /> Back
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                {/* Image Section */}
                <div className="bg-surface border border-border rounded-2xl p-8 flex items-center justify-center min-h-[400px] relative overflow-hidden group">
                    {/* Background Glow */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 via-transparent to-transparent opacity-50" />

                    {product.image ? (
                        <img src={product.image} alt={product.name} className="w-full h-full object-contain relative z-10 drop-shadow-2xl group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                        <div className="w-48 h-48 bg-zinc-800 rounded-lg animate-pulse" />
                    )}
                </div>

                {/* Info Section */}
                <div className="space-y-6">
                    <div>
                        <span className="text-primary font-semibold tracking-wider text-sm bg-primary/10 px-3 py-1 rounded-full border border-primary/20">
                            {product.category}
                        </span>
                        <h1 className="text-4xl md:text-5xl font-bold text-white mt-4">{product.name}</h1>
                        <p className="text-zinc-400 mt-4 text-lg leading-relaxed">{product.description || 'High-performance hardware for your computing needs.'}</p>
                    </div>

                    <div className="bg-surface border border-border rounded-xl p-6 space-y-4">
                        <div className="flex items-center justify-between">
                            <span className="text-zinc-400">Availability</span>
                            <span className={product.stock > 0 ? "text-emerald-500 font-medium" : "text-rose-500 font-medium"}>
                                {product.stock > 0 ? `${product.stock} Units In Stock` : 'Out of Stock'}
                            </span>
                        </div>

                        <div className="flex items-center justify-between border-t border-border/50 pt-4">
                            <span className="text-zinc-400">Base Price</span>
                            <span className="text-zinc-500 line-through font-mono">{formatINR(product.basePrice)}</span>
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <span className="text-zinc-200 font-medium">Current Price</span>
                                {isSurge && (
                                    <span className="text-xs font-bold px-2 py-0.5 rounded bg-surge/10 text-surge flex items-center gap-1 border border-surge/20 animate-pulse">
                                        <Zap size={12} /> SURGE PRICING ACTIVE
                                    </span>
                                )}
                            </div>
                            <span className={`text-4xl font-bold font-mono ${isSurge ? 'text-surge' : 'text-white'}`}>
                                {formatINR(product.currentPrice)}
                            </span>
                        </div>
                    </div>

                    <div className="flex gap-4 pt-4">
                        <button
                            disabled={product.stock === 0}
                            onClick={handleBuyNow}
                            className="flex-1 bg-white text-black font-bold text-lg py-4 rounded-xl hover:bg-zinc-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-white/5 active:scale-95 flex items-center justify-center gap-2"
                        >
                            <ShoppingCart size={20} /> Buy Now
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetails;
