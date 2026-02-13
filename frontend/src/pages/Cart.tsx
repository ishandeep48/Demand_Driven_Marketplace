import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Minus, Plus, Trash2, MapPin, CreditCard, ShoppingCart } from 'lucide-react';
import api from '../api/axios';
import { ENDPOINTS } from '../api/endpoints';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const Cart = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [cartItems, setCartItems] = useState<any[]>([]);
    const [addresses, setAddresses] = useState<any[]>([]);
    const [selectedAddress, setSelectedAddress] = useState<string>('');
    const [isLoading, setIsLoading] = useState(true);

    // Mock cart data for demonstration until backend connection
    // In real implementation, this would come from an API
    const MOCK_CART = [
        {
            product: {
                _id: '697613e1bcc6c3115a8ce5b1',
                name: 'AMD Ryzen 9 7950X3D',
                price: 749,
                image: 'https://m.media-amazon.com/images/I/51f2hkWjTlL._AC_SL1000_.jpg',
                category: 'CPU'
            },
            quantity: 1
        },
        {
            product: {
                _id: '697613e1bcc6c3115a8ce5b2',
                name: 'NVIDIA RTX 4090',
                price: 1599,
                image: 'https://m.media-amazon.com/images/I/7161c+C22tL._AC_SL1500_.jpg',
                category: 'GPU'
            },
            quantity: 2
        }
    ];

    const fetchUserData = async () => {
        try {
            // Fetch addresses
            const res = await api.get(ENDPOINTS.GET_USER_BY_ID);
            if (res.data?.data?.addresses) {
                setAddresses(res.data.data.addresses);
                // Set default address if available
                const defaultAddr = res.data.data.addresses.find((a: any) => a.isDefault);
                if (defaultAddr) {
                    setSelectedAddress(defaultAddr.addressID);
                } else if (res.data.data.addresses.length > 0) {
                    setSelectedAddress(res.data.data.addresses[0].addressID);
                }
            }

            // Fetch cart items
            // TODO: Replace with actual API call
            setCartItems(MOCK_CART);

        } catch (error) {
            console.error('Failed to fetch user data', error);
            toast.error('Failed to load cart details');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (user) {
            fetchUserData();
        }
    }, [user]);

    const updateQuantity = (index: number, delta: number) => {
        const newCart = [...cartItems];
        const newQty = newCart[index].quantity + delta;
        if (newQty > 0) {
            newCart[index].quantity = newQty;
            setCartItems(newCart);
        }
    };

    const removeItem = (index: number) => {
        const newCart = [...cartItems];
        newCart.splice(index, 1);
        setCartItems(newCart);
        toast.success('Item removed from cart');
    };

    const calculateTotal = () => {
        return cartItems.reduce((total, item) => total + (item.product.price * item.quantity), 0);
    };

    const handleCheckout = async () => {
        if (!selectedAddress) {
            toast.error('Please select a delivery address');
            return;
        }

        if (cartItems.length === 0) {
            toast.error('Your cart is empty');
            return;
        }

        toast.loading('Processing checkout...');

        // TODO: Implement actual checkout logic here
        // 1. Post to backend order creation endpoint
        // 2. Navigate to payment simulation layout

        setTimeout(() => {
            toast.dismiss();
            toast.success('Proceeding to payment...');
            // navigate('/payment/mock-order-id'); 
            // Logic to be added later
        }, 1500);
    };

    if (isLoading) {
        return <div className="text-center p-20 text-zinc-400">Loading cart...</div>;
    }

    return (
        <div className="max-w-7xl mx-auto px-6 py-12">
            <h1 className="text-4xl font-bold mb-10 flex items-center gap-3">
                <ShoppingCart className="text-primary" size={40} /> Your Cart
            </h1>

            {cartItems.length === 0 ? (
                <div className="text-center py-20 bg-surface border border-border rounded-xl">
                    <p className="text-zinc-400 text-lg mb-4">Your cart is empty</p>
                    <button
                        onClick={() => navigate('/')}
                        className="px-6 py-2 bg-primary text-black font-bold rounded-lg hover:bg-primary/90 transition-colors"
                    >
                        Browse Products
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Cart Items List */}
                    <div className="lg:col-span-2 space-y-4">
                        {cartItems.map((item, index) => (
                            <div key={index} className="bg-surface border border-border rounded-xl p-4 flex gap-4 items-center">
                                {/* Product Image */}
                                <div className="w-24 h-24 bg-background rounded-lg p-2 flex items-center justify-center shrink-0">
                                    <img
                                        src={item.product.image || 'https://via.placeholder.com/150'}
                                        alt={item.product.name}
                                        className="max-w-full max-h-full object-contain"
                                    />
                                </div>

                                {/* Details */}
                                <div className="flex-1">
                                    <h3 className="font-bold text-white text-lg">{item.product.name}</h3>
                                    <p className="text-zinc-400 text-sm">{item.product.category}</p>
                                    <p className="text-primary font-mono font-bold mt-1">
                                        {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(item.product.price * 83)}
                                    </p>
                                </div>

                                {/* Quantity Controls */}
                                <div className="flex items-center gap-3 bg-background rounded-lg p-2 border border-border/50">
                                    <button
                                        onClick={() => updateQuantity(index, -1)}
                                        className="p-1 hover:bg-zinc-700 rounded transition-colors text-zinc-400 hover:text-white"
                                        disabled={item.quantity <= 1}
                                    >
                                        <Minus size={16} />
                                    </button>
                                    <span className="font-mono font-bold w-6 text-center">{item.quantity}</span>
                                    <button
                                        onClick={() => updateQuantity(index, 1)}
                                        className="p-1 hover:bg-zinc-700 rounded transition-colors text-zinc-400 hover:text-white"
                                    >
                                        <Plus size={16} />
                                    </button>
                                </div>

                                {/* Remove Button */}
                                <button
                                    onClick={() => removeItem(index)}
                                    className="p-2 text-zinc-500 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors ml-2"
                                >
                                    <Trash2 size={20} />
                                </button>
                            </div>
                        ))}
                    </div>

                    {/* Checkout Sidebar */}
                    <div className="space-y-6">
                        {/* Address Selection */}
                        <div className="bg-surface border border-border rounded-xl p-6">
                            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                                <MapPin className="text-primary" size={20} /> Delivery Address
                            </h3>

                            {addresses.length === 0 ? (
                                <div className="text-center py-4">
                                    <p className="text-zinc-400 text-sm mb-3">No addresses found</p>
                                    <button
                                        onClick={() => navigate('/profile')}
                                        className="text-primary text-sm font-bold hover:underline"
                                    >
                                        + Add Address in Profile
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {addresses.map((addr) => (
                                        <div
                                            key={addr.addressID}
                                            onClick={() => setSelectedAddress(addr.addressID)}
                                            className={`p-3 rounded-lg border cursor-pointer transition-all ${selectedAddress === addr.addressID
                                                    ? 'border-primary bg-primary/5'
                                                    : 'border-border/50 hover:border-zinc-500'
                                                }`}
                                        >
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <p className="font-bold text-sm text-white">{addr.fullName}</p>
                                                    <p className="text-xs text-zinc-400 mt-1 line-clamp-1">
                                                        {addr.street}, {addr.city}
                                                    </p>
                                                </div>
                                                {selectedAddress === addr.addressID && (
                                                    <div className="w-2 h-2 rounded-full bg-primary mt-1.5" />
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Order Summary */}
                        <div className="bg-surface border border-border rounded-xl p-6">
                            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                                <CreditCard className="text-primary" size={20} /> Order Summary
                            </h3>

                            <div className="space-y-2 mb-4 border-b border-border pb-4">
                                <div className="flex justify-between text-zinc-400">
                                    <span>Subtotal</span>
                                    <span>{new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(calculateTotal() * 83)}</span>
                                </div>
                                <div className="flex justify-between text-zinc-400">
                                    <span>Shipping</span>
                                    <span className="text-emerald-500">Free</span>
                                </div>
                            </div>

                            <div className="flex justify-between items-center mb-6">
                                <span className="font-bold text-xl text-white">Total</span>
                                <span className="font-bold text-xl text-primary font-mono">
                                    {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(calculateTotal() * 83)}
                                </span>
                            </div>

                            <button
                                onClick={handleCheckout}
                                disabled={cartItems.length === 0}
                                className="w-full py-3 bg-primary text-black font-bold rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Proceed to Checkout
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Cart;
