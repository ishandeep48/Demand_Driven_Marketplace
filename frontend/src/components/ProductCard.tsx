import { motion } from 'framer-motion';
import { ShoppingCart, Zap, TrendingUp } from 'lucide-react';
import type { Product } from '../types';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface ProductCardProps {
    product: Product;
    index: number;
}

const formatINR = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0,
    }).format(price * 83);
};

export function cn(...inputs: (string | undefined | null | false)[]) {
    return twMerge(clsx(inputs));
}

const ProductCard = ({ product, index }: ProductCardProps) => {
    const isSurge = product.currentPrice > product.basePrice;
    const stockColor = product.stock > 0 ? 'text-emerald-500' : 'text-rose-500';

    // Demand score glow intensity (0-100 mapped to opacity)
    const glowOpacity = Math.min(product.demandScore / 100, 1);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.05 }}
            className="group relative bg-surface border border-border rounded-xl p-5 hover:border-zinc-700 transition-colors overflow-hidden"
        >
            {/* Demand Glow Background */}
            <div
                className="absolute -top-20 -right-20 w-40 h-40 bg-primary/20 blur-[80px] rounded-full pointer-events-none transition-opacity duration-500"
                style={{ opacity: glowOpacity * 0.5 }}
            />

            <div className="flex justify-between items-start mb-4">
                <div>
                    <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">{product.category}</span>
                    <h3 className="text-lg font-bold text-white leading-tight mt-1">{product.name}</h3>
                </div>
                <div className={cn("flex items-center gap-1 text-xs font-medium px-2 py-1 rounded bg-zinc-900/80 border border-border", stockColor)}>
                    <div className={cn("w-1.5 h-1.5 rounded-full", product.stock > 0 ? "bg-emerald-500" : "bg-rose-500")} />
                    {product.stock > 0 ? `${product.stock} Stock` : 'Out of Stock'}
                </div>
            </div>

            <div className="space-y-3">
                <div className="flex items-center justify-between">
                    <span className="text-zinc-400 text-sm">Base Price</span>
                    <span className="text-zinc-400 font-mono line-through text-sm">{formatINR(product.basePrice)}</span>
                </div>

                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <span className="text-zinc-400 text-sm">Current</span>
                        {isSurge && (
                            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-surge/10 text-surge flex items-center gap-1">
                                <Zap size={10} /> SURGE
                            </span>
                        )}
                    </div>
                    <span className={cn("text-xl font-bold font-mono", isSurge ? "text-surge" : "text-white")}>
                        {formatINR(product.currentPrice)}
                    </span>
                </div>

                {/* Demand Badge */}
                <div className="flex items-center justify-between pt-4 border-t border-border/50">
                    <div className="flex items-center gap-2">
                        <TrendingUp size={14} className={cn("transition-colors", product.demandScore > 80 ? "text-rose-400" : "text-zinc-500")} />
                        <span className="text-xs text-zinc-500">Demand Score: <span className="text-zinc-300">{product.demandScore}%</span></span>
                    </div>
                    <button className="p-2 bg-white text-black rounded-lg hover:bg-zinc-200 transition-colors flex items-center justify-center">
                        <ShoppingCart size={18} />
                    </button>
                </div>
            </div>

            {/* Hover Line */}
            <div className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-primary to-accent w-0 group-hover:w-full transition-all duration-300 ease-out" />
        </motion.div>
    );
};

export default ProductCard;
