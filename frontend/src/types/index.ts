export interface User {
    userID: string;
    // name: string;
    // email: string;
    role: 'customer' | 'admin';
}

export interface Product {
    id: string;
    name: string;
    description: string;
    basePrice: number;
    currentPrice: number;
    stock: number;
    image: string;
    category: string;
    demandScore: number; // 0-100 indicating current demand
}

export interface Address {
    id: string;
    street: string;
    city: string;
    state: string;
    zip: string;
    isDefault: boolean;
    phone?: string;
}

export interface CartItem {
    productID: string;
    quantity: number;
}

export interface PurchasePayload {
    userID: string;
    items: CartItem[];
    addressID: string;
    paymentMethod: 'card' | 'upi' | 'cod';
}

export interface OrderItem {
    productName: string;
    quantity: number;
    price: number;
}

export interface Order {
    id: string;
    date: string;
    status: 'pending' | 'completed' | 'failed' | 'cancelled';
    totalAmount: number;
    items: OrderItem[];
}
