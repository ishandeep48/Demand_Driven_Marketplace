import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { ENDPOINTS } from '../api/endpoints';
import { Loader2, ShieldCheck, XCircle, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

interface TotalAmountResponse {
    orderId: string;
    totalAmount: number;
}

const PaymentSimulation = () => {
    const { orderId } = useParams<{ orderId: string }>();
    const navigate = useNavigate();
    const [amount, setAmount] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);
    const [status, setStatus] = useState<'pending' | 'success' | 'failed'>('pending');

    useEffect(() => {
        const fetchAmount = async () => {
            try {
                const response = await api.get<TotalAmountResponse>(ENDPOINTS.TOTAL_AMOUNT(orderId!));
                setAmount(response.data.totalAmount); // Verify if structure is correct
            } catch (error) {
                console.error('Failed to fetch amount:', error);
                toast.error('Could not load payment details');
            } finally {
                setLoading(false);
            }
        };

        if (orderId) fetchAmount();
    }, [orderId]);

    const handleSuccess = async () => {
        setLoading(true);
        try {
            await api.post(ENDPOINTS.MOCK_PAYMENT_SUCCESS, { orderId });
            setStatus('success');
            toast.success('Payment Successful!');
            setTimeout(() => navigate('/profile'), 2000);
        } catch (error) {
            console.error('Payment failed:', error);
            toast.error('Payment verification failed');
            setLoading(false);
        }
    };

    const handleFailure = async () => {
        setLoading(true);
        try {
            await api.post(ENDPOINTS.MOCK_PAYMENT_FAIL, { orderId });
            setStatus('failed');
            toast.error('Payment Failed');
            setLoading(false);
        } catch (error) {
            console.error('Simulation failed:', error);
            setLoading(false);
        }
    };

    const handleAbort = async () => {
        try {
            await api.post(ENDPOINTS.MOCK_PAYMENT_ABORT);
            navigate('/');
        } catch (error) {
            navigate('/');
        }
    };

    if (loading && status === 'pending') {
        return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin text-primary w-12 h-12" /></div>;
    }

    if (status === 'success') {
        return (
            <div className="min-h-screen flex items-center justify-center p-4">
                <div className="text-center space-y-4">
                    <CheckCircle className="w-24 h-24 text-emerald-500 mx-auto" />
                    <h1 className="text-3xl font-bold text-white">Payment Successful</h1>
                    <p className="text-zinc-400">Redirecting to your orders...</p>
                </div>
            </div>
        );
    }

    if (status === 'failed') {
        return (
            <div className="min-h-screen flex items-center justify-center p-4">
                <div className="text-center space-y-4">
                    <XCircle className="w-24 h-24 text-rose-500 mx-auto" />
                    <h1 className="text-3xl font-bold text-white">Payment Failed</h1>
                    <p className="text-zinc-400">Transaction declined by bank.</p>
                    <div className="flex justify-center gap-4 mt-6">
                        <button onClick={() => setStatus('pending')} className="bg-primary text-black font-bold px-6 py-2 rounded-lg hover:bg-primary/90">
                            Retry
                        </button>
                        <button onClick={handleAbort} className="bg-zinc-800 text-white font-bold px-6 py-2 rounded-lg hover:bg-zinc-700">
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4">
            <div className="w-full max-w-lg bg-white text-black rounded-2xl shadow-2xl overflow-hidden">
                <div className="bg-indigo-600 p-6 text-white flex justify-between items-center">
                    <div className="flex items-center gap-2 font-bold">
                        <ShieldCheck /> Secure Gateway
                    </div>
                </div>

                <div className="p-8">
                    <div className="text-center mb-8">
                        <p className="text-zinc-500 text-sm uppercase tracking-wide">Total Amount</p>
                        <h1 className="text-4xl font-bold mt-2">
                            {amount ? new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount * 83) : 'Loading...'}
                        </h1>
                    </div>

                    <div className="space-y-4">
                        <p className="text-center text-zinc-500 mb-4">Simulate Payment Response</p>

                        <button
                            onClick={handleSuccess}
                            className="w-full bg-emerald-500 text-white font-bold py-3 rounded-lg hover:bg-emerald-600 transition-colors shadow-lg shadow-emerald-500/20"
                        >
                            Simulate Success
                        </button>

                        <div className="grid grid-cols-2 gap-4">
                            <button
                                onClick={handleFailure}
                                className="bg-rose-500 text-white font-bold py-3 rounded-lg hover:bg-rose-600 transition-colors shadow-lg shadow-rose-500/20"
                            >
                                Simulate Failure
                            </button>
                            <button
                                onClick={handleAbort}
                                className="bg-zinc-200 text-zinc-700 font-bold py-3 rounded-lg hover:bg-zinc-300 transition-colors"
                            >
                                Abort
                            </button>
                        </div>
                    </div>
                </div>

                <div className="bg-zinc-50 p-4 text-center text-xs text-zinc-400 border-t">
                    This is a mock payment gateway for demonstration purposes.
                </div>
            </div>
        </div>
    );
};

export default PaymentSimulation;
