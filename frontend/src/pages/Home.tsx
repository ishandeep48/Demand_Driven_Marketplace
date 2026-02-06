import { useProducts } from '../hooks/useProducts';
import ProductCard from '../components/ProductCard';

const Home = () => {
    const { data: products, isLoading, error } = useProducts();

    if (isLoading) {
        return (
            <div className="min-h-screen pt-24 px-6 max-w-7xl mx-auto flex items-center justify-center text-zinc-500">
                <div className="animate-pulse flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
                    <p>Loading Marketplace Data...</p>
                </div>
            </div>
        );
    }
    if (error) {
        return (
            <div className="min-h-screen pt-24 px-6 max-w-7xl mx-auto text-center">
                <div className="inline-block p-6 rounded-xl bg-rose-500/10 border border-rose-500/20">
                    <h2 className="text-rose-500 font-bold mb-2">Connection Error</h2>
                    <p className="text-zinc-400">Could not connect to the market server.</p>
                </div>
            </div>
        );
    }

    return (
        <main className="max-w-7xl mx-auto px-6 py-8">
            <header className="mb-10">
                <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-zinc-500">
                    Available <span className="text-primary">Hardware</span>
                </h1>
                <p className="text-zinc-400 max-w-2xl text-lg">
                    Live market data for high-performance GPUs and processors. Monitor surge pricing and stock levels in real-time.
                </p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {products?.map((product, index) => (
                    <ProductCard key={product.id} product={product} index={index} />
                ))}
                {products?.length === 0 && (
                    <div className="col-span-full py-20 text-center text-zinc-500">
                        No products found.
                    </div>
                )}
            </div>
        </main>
    );
};

export default Home;
