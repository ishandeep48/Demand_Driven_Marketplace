import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import api from '../api/axios';
import { ENDPOINTS } from '../api/endpoints';
import type { Address, Product } from '../types';
import { useAuth } from '../context/AuthContext';
import { Loader2, MapPin, CheckCircle, Smartphone } from 'lucide-react';
import toast from 'react-hot-toast';

const MOCK_ADDRESSES: Address[] = [
    {
        id: 'addr_1',
        street: '123 Silicon Valley Rd',
        city: 'Bangalore',
        state: 'Karnataka',
        zip: '560100',
        isDefault: true,
        phone: '+91 98765 43210'
    },
    {
        id: 'addr_2',
        street: '456 Cyber Hub',
        city: 'Gurgaon',
        state: 'Haryana',
        zip: '122002',
        isDefault: false,
        phone: '+91 99887 76655'
    }
];

const Checkout = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [selectedAddress, setSelectedAddress] = useState<string>(MOCK_ADDRESSES[0].id);
    const [processing, setProcessing] = useState(false);

    // Fetch product details again for the summary
    const { data: product, isLoading } = useQuery({
        queryKey: ['product', id],
        queryFn: async () => {
            const response = await api.get<{ data: Product }>(ENDPOINTS.PRODUCT_DETAILS(id!));
            return response.data.data;
        },
        enabled: !!id,
    });

    const handlePlaceOrder = async () => {
        if (!user || !product) return;
        setProcessing(true);

        try {
            const payload = {
                userID: user.id, // In a real app auth might inject this on backend, or we send it
                items: [
                    { productID: product.id, quantity: 1 } // Simplified single item checkout
                ],
                addressID: selectedAddress,
                paymentMethod: 'card'
            };

            const response = await api.post(ENDPOINTS.PURCHASE, payload);
            const { orderId } = response.data; // Assuming response structure { orderId, paymentUrl }

            // Redirect to Payment Simulation
            navigate(`/payment/${orderId}`);

        } catch (error: any) {
            console.error('Order placement failed:', error);
            toast.error(error.response?.data?.message || 'Failed to place order');
        } finally {
            setProcessing(false);
        }
    };

    if (isLoading) return <div className="flex justify-center p-20"><Loader2 className="animate-spin text-primary" /></div>;
    if (!product) return <div className="p-20 text-center">Product not found</div>;

    return (
        <div className="max-w-4xl mx-auto px-6 py-12">
            <h1 className="text-3xl font-bold mb-8">Checkout</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Left Column: Details & Address */}
                <div className="md:col-span-2 space-y-8">
                    {/* Product Review */}
                    <div className="bg-surface border border-border rounded-xl p-6 flex gap-4 items-center">
                        <div className="w-20 h-20 bg-zinc-800 rounded-lg flex-shrink-0 flex items-center justify-center p-2">
                            {product.image && <img src={product.image} alt="" className="max-w-full max-h-full" />}
                        </div>
                        <div>
                            <h3 className="font-bold text-lg">{product.name}</h3>
                            <p className="text-zinc-400 text-sm">Category: {product.category}</p>
                            <p className="text-primary font-mono mt-1 font-bold">
                                {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(product.currentPrice * 83)}
                            </p>
                        </div>
                    </div>

                    {/* Address Selection */}
                    <div>
                        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                            <MapPin className="text-primary" /> Select Delivery Address
                        </h2>
                        <div className="space-y-4">
                            {MOCK_ADDRESSES.map((addr) => (
                                <div
                                    key={addr.id}
                                    onClick={() => setSelectedAddress(addr.id)}
                                    className={`relative cursor-pointer border rounded-xl p-5 transition-all ${selectedAddress === addr.id
                                        ? 'bg-primary/5 border-primary ring-1 ring-primary/50'
                                        : 'bg-surface border-border hover:border-zinc-600'
                                        }`}
                                >
                                    {selectedAddress === addr.id && (
                                        <div className="absolute top-4 right-4 text-emerald-500">
                                            <CheckCircle size={20} fill="currentColor" className="text-black" />
                                        </div>
                                    )}

                                    <div className="flex items-start gap-3">
                                        <div className={`mt-1 w-4 h-4 rounded-full border flex items-center justify-center ${selectedAddress === addr.id ? 'border-primary' : 'border-zinc-500'}`}>
                                            {selectedAddress === addr.id && <div className="w-2 h-2 rounded-full bg-primary" />}
                                        </div>
                                        <div>
                                            <p className="font-bold text-white">{addr.street}</p>
                                            <p className="text-zinc-400">{addr.city}, {addr.state} - {addr.zip}</p>
                                            <p className="text-zinc-500 text-sm mt-2 flex items-center gap-1">
                                                <Smartphone size={14} /> {addr.phone}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Column: Order Summary */}
                <div className="bg-surface border border-border rounded-xl p-6 h-fit sticky top-24">
                    <h3 className="font-bold text-xl mb-4">Order Summary</h3>

                    <div className="space-y-3 mb-6">
                        <div className="flex justify-between text-zinc-400">
                            <span>Subtotal</span>
                            <span>{new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(product.currentPrice * 83)}</span>
                        </div>
                        <div className="flex justify-between text-zinc-400">
                            <span>Shipping</span>
                            <span className="text-emerald-500">Free</span>
                        </div>
                        <div className="h-px bg-border my-2" />
                        <div className="flex justify-between text-white font-bold text-lg">
                            <span>Total</span>
                            <span>{new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(product.currentPrice * 83)}</span>
                        </div>
                    </div>

                    <button
                        onClick={handlePlaceOrder}
                        disabled={processing}
                        className="w-full bg-primary text-black font-bold py-3 rounded-lg hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20 disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                        {processing && <Loader2 className="animate-spin w-4 h-4" />}
                        {processing ? 'Processing...' : 'Place Order'}
                    </button>

                    <p className="text-xs text-center text-zinc-500 mt-4">
                        Secure checkout powered by Razorpay (Mock)
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
