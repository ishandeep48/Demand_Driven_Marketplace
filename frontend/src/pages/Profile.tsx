import type { Order } from '../types';
import { Mail, MapPin, Package, Phone, Edit, Trash2 } from 'lucide-react';
import api from '../api/axios';
import { ENDPOINTS } from '../api/endpoints';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { sub } from 'framer-motion/client';

// Mock Orders as API is not ready
// const MOCK_ORDERS: Order[] = [
//     {
//         id: 'ord_123',
//         date: '2023-10-25T10:30:00Z',
//         status: 'completed',
//         totalAmount: 45000 / 83, // Approx $542
//         items: [
//             { productName: 'RTX 4060', quantity: 1, price: 45000 / 83 }
//         ]
//     },
//     {
//         id: 'ord_124',
//         date: '2023-10-20T14:15:00Z',
//         status: 'pending',
//         totalAmount: 120000 / 83, // Approx $1445
//         items: [
//             { productName: 'i9-14900K', quantity: 1, price: 55000 / 83 },
//             { productName: 'Z790 Motherboard', quantity: 1, price: 65000 / 83 }
//         ]
//     }
// ];

const INDIAN_STATES = [
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa', 'Gujarat',
    'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra',
    'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim',
    'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
    'Andaman and Nicobar Islands', 'Chandigarh', 'Dadra and Nagar Haveli and Daman and Diu',
    'Delhi', 'Jammu and Kashmir', 'Ladakh', 'Lakshadweep', 'Puducherry'
];

const Profile = () => {
    const [editAddressID, setEditAddressID] = useState(null);
    const [orders, setOrders] = useState(null);
    const getUserData = async () => {
        try {
            const res = await api.get(ENDPOINTS.GET_USER_BY_ID);
            const order_res = await api.get(ENDPOINTS.GET_ORDERS);
            // console.log(res.data.data);
            console.log(res.data.data)
            console.log('orders are ', order_res.data.data);
            const sortedAddresses = res.data.data.addresses.sort((a: any, b: any) => (b.isDefault === true ? 1 : 0) - (a.isDefault === true ? 1 : 0));
            setAddresses(sortedAddresses);
            setUser(res.data.data);
            setOrders(order_res.data.data);
        } catch (err) {
            console.log(err)
        }
    }
    // const { user } = useAuth();
    const [user, setUser]: any = useState(null);
    const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [submitAddress, setSubmitAddress] = useState({
        fullName: '',
        street: '',
        city: '',
        state: '',
        postalCode: '',
        phone: '',
        country: 'India',
        isDefault: false
    })

    const [addresses, setAddresses] = useState<any[]>([]);
    const handleChangeAddress = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSubmitAddress({
            ...submitAddress,
            [e.target.name]: e.target.value
        })
    }
    useEffect(() => {
        getUserData();
    }, []);
    // Run all these before loading

    const handleAddressSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (isEditing) {
            const response = await api.post(ENDPOINTS.UPDATE_ADDRESS, { ...submitAddress, addressID: editAddressID });
            console.log(response.data);
            if (response.data.code == "OK") {
                setIsAddressModalOpen(false);
                toast.success("Address updated successfully");
                setSubmitAddress({
                    fullName: '',
                    street: '',
                    city: '',
                    state: '',
                    postalCode: '',
                    phone: '',
                    country: 'India',
                    isDefault: false
                })
                getUserData();
            } else {
                toast.error("Failed to update address, Try Again");
                toast.error(response.data.message);
            }

            // return;
        } else {
            const response = await api.post(ENDPOINTS.ADD_ADDRESS, submitAddress);
            console.log(response.data);
            if (response.data.code == "OK") {
                setIsAddressModalOpen(false);
                toast.success("Address added successfully");
                setSubmitAddress({
                    fullName: '',
                    street: '',
                    city: '',
                    state: '',
                    postalCode: '',
                    phone: '',
                    country: 'India',
                    isDefault: false
                })
                getUserData();
            } else {
                toast.error("Failed to add address, Try Again");
                toast.error(response.data.message);
            }
        }

        // API calls and saving logic will be handled by the user later
        setIsAddressModalOpen(false);
        // await api.post('/test-post', submitAddress);

    };

    const handleAddNewClick = () => {
        setIsEditing(false);
        setSubmitAddress({
            fullName: '',
            street: '',
            city: '',
            state: '',
            postalCode: '',
            phone: '',
            country: 'India',
            isDefault: false
        });
        setIsAddressModalOpen(true);
    };

    const handleEditClick = (address: any) => {
        setIsEditing(true);
        setSubmitAddress({
            fullName: address.fullName || '',
            street: address.street || '',
            city: address.city || '',
            state: address.state || '',
            postalCode: address.postalCode || '',
            phone: address.phone || '',
            country: address.country || 'India',
            isDefault: address.isDefault || false
        });
        setIsAddressModalOpen(true);
    };
    const handleDeleteAddress = async (addressID: string) => {
        try {
            const response = await api.post(ENDPOINTS.DELETE_ADDRESS, { addressID });
            if (response.data.code == "OK") {
                toast.success("Address deleted successfully");
                getUserData();
            } else {
                toast.error("Failed to delete address, Try Again");
                toast.error(response.data.message);
            }
        } catch (error: any) {
            toast.error("Failed to delete address, Try Again");
            if (error.response && error.response.data && error.response.data.message) {
                toast.error(error.response.data.message);
            } else {
                toast.error("An unexpected error occurred");
            }
        }
    }

    if (!user) return <div className="p-20 text-center">Please login or check your internet connection</div>;

    return (
        <div className="max-w-7xl mx-auto px-6 py-12 relative">
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
                            <button
                                onClick={handleAddNewClick}
                                className="text-primary hover:underline text-sm font-bold"
                            >
                                + Add New
                            </button>
                        </div>

                        <div className="space-y-4">
                            {addresses.map(addr => (
                                <div key={addr.addressID} className="bg-background/50 border border-border rounded-lg p-4 relative group hover:border-zinc-600 transition-colors">
                                    {addr.isDefault && (
                                        <span className="absolute top-4 right-4 text-[10px] font-bold bg-emerald-500/10 text-emerald-500 px-2 py-1 rounded-full uppercase tracking-wider">
                                            Default
                                        </span>
                                    )}
                                    <p className="font-bold text-white mb-1">{addr.fullName}</p>
                                    <p className="text-zinc-400 text-sm">{addr.street}, {addr.city}, {addr.state} - {addr.postalCode}</p>
                                    <p className="text-zinc-500 text-xs mt-3 flex items-center gap-1">
                                        <Phone size={12} /> {addr.phone} - {addr.country}
                                    </p>

                                    <button
                                        onClick={() => { handleEditClick(addr); setEditAddressID(addr.addressID) }}
                                        className="absolute bottom-4 right-4 bg-zinc-800 p-1.5 rounded-md text-zinc-400 hover:text-white hover:bg-zinc-700 opacity-0 group-hover:opacity-100 transition-all"
                                    >
                                        <Edit size={14} />
                                    </button>
                                    <button className="absolute bottom-4 right-12 bg-zinc-800 p-1.5 rounded-md text-zinc-400 hover:text-white hover:bg-zinc-700 opacity-0 group-hover:opacity-100 transition-all"
                                        onClick={() => { handleDeleteAddress(addr.addressID) }}
                                    >
                                        <Trash2 size={14} />
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
                            {orders.map(order => (
                                <div key={order.orderID} className="bg-background/50 border border-border rounded-lg p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <span className="font-mono text-sm text-zinc-500">#{order.orderID}</span>
                                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${order.orderStatus === 'completed' ? 'bg-emerald-500/10 text-emerald-500' :
                                                order.orderStatus === 'pending' ? 'bg-yellow-500/10 text-yellow-500' : order.orderStatus === 'paid' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'
                                                }`}>
                                                {order.orderStatus}
                                            </span>
                                        </div>
                                        <p className="text-zinc-400 text-sm mb-1">
                                            {new Date(order.orderedAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
                                        </p>
                                        <p className="text-white text-sm">
                                            {order.items.map(i => `${i.product.name} (x${i.quantity})`).join(', ')}
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

            {/* Add Address Modal */}
            {isAddressModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                    <div className="bg-surface border border-border rounded-xl w-full max-w-lg overflow-y-auto max-h-[90vh] shadow-2xl animate-in fade-in zoom-in duration-200">
                        <div className="p-6 border-b border-border">
                            <h2 className="text-xl font-bold text-white">{isEditing ? 'Update Address' : 'Add New Address'}</h2>
                        </div>

                        <form onSubmit={handleAddressSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-zinc-400 mb-1">Full Name</label>
                                <input
                                    type="text"
                                    required
                                    name="fullName"
                                    className="w-full bg-background border border-border rounded-lg px-3 py-2 text-white focus:outline-none focus:border-primary transition-colors"
                                    placeholder="John Doe"
                                    value={submitAddress.fullName}
                                    onChange={handleChangeAddress}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-zinc-400 mb-1">Street Address</label>
                                <input
                                    type="text"
                                    name="street"
                                    required
                                    className="w-full bg-background border border-border rounded-lg px-3 py-2 text-white focus:outline-none focus:border-primary transition-colors"
                                    placeholder="123 Main St, Apt 4B"
                                    value={submitAddress.street}
                                    onChange={handleChangeAddress}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-zinc-400 mb-1">City</label>
                                    <input
                                        type="text"
                                        name="city"
                                        required
                                        className="w-full bg-background border border-border rounded-lg px-3 py-2 text-white focus:outline-none focus:border-primary transition-colors"
                                        placeholder="Mumbai"
                                        value={submitAddress.city}
                                        onChange={handleChangeAddress}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-zinc-400 mb-1">State</label>
                                    <select
                                        required
                                        className="w-full bg-background border border-border rounded-lg px-3 py-2 text-white focus:outline-none focus:border-primary transition-colors appearance-none"
                                        value={submitAddress.state}
                                        onChange={handleChangeAddress}
                                        name="state"
                                    >
                                        <option value="" disabled selected>Select State</option>
                                        {INDIAN_STATES.sort().map(state => (
                                            <option key={state} value={state}>{state}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-zinc-400 mb-1">Country</label>
                                    <select
                                        required
                                        className="w-full bg-background border border-border rounded-lg px-3 py-2 text-white focus:outline-none focus:border-primary transition-colors appearance-none"
                                        value={submitAddress.country}
                                        onChange={handleChangeAddress}
                                        name="country"
                                    >
                                        <option value="India">India</option>
                                        <option value="Outside India">Outside India</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-zinc-400 mb-1">Postal Code</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full bg-background border border-border rounded-lg px-3 py-2 text-white focus:outline-none focus:border-primary transition-colors"
                                        placeholder="400001"
                                        value={submitAddress.postalCode}
                                        onChange={handleChangeAddress}
                                        name="postalCode"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-zinc-400 mb-1">Phone Number</label>
                                <div className="flex items-center gap-2">
                                    <span className="bg-background border border-border rounded-lg px-3 py-2 text-zinc-400">+91</span>
                                    <input
                                        type="tel"
                                        required
                                        className="w-full bg-background border border-border rounded-lg px-3 py-2 text-white focus:outline-none focus:border-primary transition-colors"
                                        placeholder="98765 43210"
                                        value={submitAddress.phone}
                                        onChange={handleChangeAddress}
                                        name="phone"
                                    />
                                </div>
                            </div>

                            <div
                                className="flex items-center gap-3 cursor-pointer group"
                                onClick={() => setSubmitAddress({ ...submitAddress, isDefault: !submitAddress.isDefault })}
                            >
                                <div className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background ${submitAddress.isDefault ? 'bg-primary' : 'bg-zinc-700'}`}>
                                    <span
                                        className={`${submitAddress.isDefault ? 'translate-x-6' : 'translate-x-1'
                                            } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                                    />
                                </div>
                                <label className="text-sm text-zinc-400 cursor-pointer group-hover:text-white transition-colors">
                                    Set as default address
                                </label>
                            </div>

                            <div className="flex items-center justify-end gap-3 pt-4 border-t border-border mt-6">
                                <button
                                    type="button"
                                    onClick={() => setIsAddressModalOpen(false)}
                                    className="px-4 py-2 text-sm font-bold text-zinc-400 hover:text-white transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-6 py-2 bg-primary hover:bg-primary/90 text-black font-bold rounded-lg text-sm transition-colors"
                                >
                                    {isEditing ? 'Update Address' : 'Save Address'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Profile;
