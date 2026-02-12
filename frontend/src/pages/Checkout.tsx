import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import api from '../api/axios';
import { ENDPOINTS } from '../api/endpoints';
import type { Address, Product } from '../types';
import { useAuth } from '../context/AuthContext';
import { Loader2, MapPin, CheckCircle, Phone } from 'lucide-react';
import toast from 'react-hot-toast';


const Checkout = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [processing, setProcessing] = useState(false);
    const [addresses, setAddresses] = useState([{
        addressID: '',
        city: '',
        country: '',
        fullName: '',
        isDefault: '',
        phone: '',
        postalCode: '',
        state: '',
        street: ''
    }])
    const [selectedAddress, setSelectedAddress] = useState<string>(addresses[0].addressID);
    const getAddress = async () => {
        try {
            const response = await api.get(ENDPOINTS.GET_ADDRESSES);
            // console.log(response.data.message);
            if (response.data.code === 'OK') {
                setAddresses(response.data.message);
                const selectedID = response.data.message.find(addr => addr.isDefault)
                setSelectedAddress(selectedID.addressID)
            }
        } catch (err) {
            toast('Couldnt Load Your Addresses')
        }
    }
    useEffect(() => {
        getAddress();

    }, [])
    // Fetch product details again for the summary
    const { data: product, isLoading } = useQuery({
        queryKey: ['product', id],
        queryFn: async () => {
            const response = await api.get<{ data: Product }>(ENDPOINTS.PRODUCT_DETAILS(id!));
            // console.log(response);
            return response.data.data;
        },
        enabled: !!id,
    });

    const handlePlaceOrder = async () => {
        if (!user || !product) return;
        setProcessing(true);

        try {
            console.log(user);
            const payload = {
                userID: user.userID, // In a real app auth might inject this on backend, or we send it
                items: [
                    { productID: product._id, quantity: 1 } // Simplified single item checkout
                ],
                addressID: selectedAddress,
                paymentMethod: 'mock'
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
                            {addresses.map((addr) => (
                                <div
                                    key={addr.addressID}
                                    onClick={() => setSelectedAddress(addr.addressID)}
                                    className={`relative cursor-pointer border rounded-xl p-5 transition-all ${selectedAddress === addr.addressID
                                        ? 'bg-primary/5 border-primary ring-1 ring-primary/50'
                                        : 'bg-surface border-border hover:border-zinc-600'
                                        }`}
                                >
                                    {selectedAddress === addr.addressID && (
                                        <div className="absolute top-4 right-4 text-emerald-500">
                                            <CheckCircle size={20} fill="currentColor" className="text-black" />
                                        </div>
                                    )}

                                    <div className="flex items-start gap-3">
                                        <div className={`mt-1 w-4 h-4 rounded-full border flex items-center justify-center ${selectedAddress === addr.addressID ? 'border-primary' : 'border-zinc-500'}`}>
                                            {selectedAddress === addr.addressID && <div className="w-2 h-2 rounded-full bg-primary" />}
                                        </div>
                                        <div>
                                            <p className="font-bold text-white">{addr.fullName}</p>
                                            <p className="text-zinc-400">{addr.street}, {addr.city}, {addr.state} - {addr.postalCode}</p>
                                            <p className="text-zinc-500 text-sm mt-2 flex items-center gap-1">
                                                <Phone size={14} /> {addr.phone}
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
                            <span className="text-emerald-500">Free (For Now)</span>
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
