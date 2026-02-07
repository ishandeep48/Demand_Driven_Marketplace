import type { Address, Order } from '../types';
import { Mail, MapPin, Package, Phone, Edit } from 'lucide-react';
import api from '../api/axios';
import { ENDPOINTS } from '../api/endpoints';
import { useEffect, useState } from 'react';
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

// Mock Orders as API is not ready
const MOCK_ORDERS: Order[] = [
    {
        id: 'ord_123',
        date: '2023-10-25T10:30:00Z',
        status: 'completed',
        totalAmount: 45000 / 83, // Approx $542
        items: [
            { productName: 'RTX 4060', quantity: 1, price: 45000 / 83 }
        ]
    },
    {
        id: 'ord_124',
        date: '2023-10-20T14:15:00Z',
        status: 'pending',
        totalAmount: 120000 / 83, // Approx $1445
        items: [
            { productName: 'i9-14900K', quantity: 1, price: 55000 / 83 },
            { productName: 'Z790 Motherboard', quantity: 1, price: 65000 / 83 }
        ]
    }
];

const Profile = () => {
    // const { user } = useAuth();
    const [user, setUser]: any = useState(null);
    // const userID = user?.userID;
    // const res = await api.get(ENDPOINTS.GET_USER_BY_ID(userID));
    useEffect(() => {
        // if (!user) return;

        const getUserData = async () => {
            try {
                const res = await api.get(ENDPOINTS.GET_USER_BY_ID);
                // console.log(res.data.data);
                setUser(res.data.data);
            } catch (err) {
                console.log(err)
            }
        }
        getUserData();
    }, []);
    if (!user) return <div className="p-20 text-center">Please login or check your internet connection</div>;

    return (
        <div className="max-w-7xl mx-auto px-6 py-12">
            <h1 className="text-4xl font-bold mb-10">My Account</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* User Info & Addresses */}
                <div className="space-y-8">
                    {/* Info Card */}
                    <div className="bg-surface border border-border rounded-xl p-6">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center text-black font-bold text-2xl">
                                {user.name?.charAt(0).toUpperCase() || "X"}
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-white">{user.name || "Loading..."}</h2>
                                <div className="flex items-center gap-2 text-zinc-400 text-sm mt-1">
                                    <Mail size={14} /> {user.email || "Loading..."}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Addresses */}
                    <div className="bg-surface border border-border rounded-xl p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="font-bold text-lg flex items-center gap-2">
                                <MapPin className="text-primary" size={20} /> Saved Addresses
                            </h3>
                            <button className="text-primary hover:underline text-sm font-bold">
                                + Add New
                            </button>
                        </div>

                        <div className="space-y-4">
                            {MOCK_ADDRESSES.map(addr => (
                                <div key={addr.id} className="bg-background/50 border border-border rounded-lg p-4 relative group hover:border-zinc-600 transition-colors">
                                    {addr.isDefault && (
                                        <span className="absolute top-4 right-4 text-[10px] font-bold bg-emerald-500/10 text-emerald-500 px-2 py-1 rounded-full uppercase tracking-wider">
                                            Default
                                        </span>
                                    )}
                                    <p className="font-bold text-white mb-1">{addr.street}</p>
                                    <p className="text-zinc-400 text-sm">{addr.city}, {addr.state} - {addr.zip}</p>
                                    <p className="text-zinc-500 text-xs mt-3 flex items-center gap-1">
                                        <Phone size={12} /> {addr.phone}
                                    </p>

                                    <button className="absolute bottom-4 right-4 bg-zinc-800 p-1.5 rounded-md text-zinc-400 hover:text-white hover:bg-zinc-700 opacity-0 group-hover:opacity-100 transition-all">
                                        <Edit size={14} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Order History */}
                <div className="lg:col-span-2">
                    <div className="bg-surface border border-border rounded-xl p-6 min-h-[500px]">
                        <h3 className="font-bold text-lg flex items-center gap-2 mb-6">
                            <Package className="text-primary" size={20} /> Order History
                        </h3>

                        <div className="space-y-4">
                            {MOCK_ORDERS.map(order => (
                                <div key={order.id} className="bg-background/50 border border-border rounded-lg p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <span className="font-mono text-sm text-zinc-500">#{order.id}</span>
                                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${order.status === 'completed' ? 'bg-emerald-500/10 text-emerald-500' :
                                                order.status === 'pending' ? 'bg-yellow-500/10 text-yellow-500' : 'bg-red-500/10 text-red-500'
                                                }`}>
                                                {order.status}
                                            </span>
                                        </div>
                                        <p className="text-zinc-400 text-sm mb-1">
                                            {new Date(order.date).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
                                        </p>
                                        <p className="text-white text-sm">
                                            {order.items.map(i => `${i.productName} (x${i.quantity})`).join(', ')}
                                        </p>
                                    </div>

                                    <div className="text-right">
                                        <p className="text-lg font-bold font-mono text-white">
                                            {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(order.totalAmount * 83)}
                                        </p>
                                        <button className="mt-2 text-sm text-primary hover:underline">View Invoice</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
