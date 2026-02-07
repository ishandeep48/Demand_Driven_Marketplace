import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import { ENDPOINTS } from '../api/endpoints';
import toast from 'react-hot-toast';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await api.post(ENDPOINTS.LOGIN, { email, password });

            // Assuming successful login for now. 
            // In a real app we might fetch user details here if the login response doesn't return them.
            // For this mock/task, let's assume we can derive or need to fetch user info.
            // Since the prompt mock backend doesn't specify response body for login beyond "success", 
            // we'll mock the user object or fetch it if there was a /me endpoint.
            // Given the constraints, I will mock the user data derived from the email for the context.

            // const mockUser = {
            //     id: 'mock-user-id', // In a real app, this comes from backend
            //     name: 'User', // We might not know the name from just login email/pw
            //     email: email,
            //     role: 'customer' as const,
            // };

            const data = res.data;
            login(data.data);
            toast.success('Logged in successfully!');
            navigate('/');
        } catch (error: any) {
            console.error('Login error:', error);
            const msg = error.response?.data?.message || 'Failed to login';
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen pt-24 flex items-center justify-center px-4">
            <div className="w-full max-w-md bg-surface border border-border rounded-2xl p-8">
                <h2 className="text-3xl font-bold text-white mb-6 text-center">Welcome Back</h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-zinc-400 mb-1">Email</label>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-background border border-border rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary transition-colors"
                            placeholder="you@example.com"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-zinc-400 mb-1">Password</label>
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-background border border-border rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary transition-colors"
                            placeholder="••••••••"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-primary text-black font-bold py-3 rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-4"
                    >
                        {loading ? 'Logging in...' : 'Sign In'}
                    </button>

                    <p className="text-center text-zinc-500 text-sm mt-4">
                        Don't have an account?{' '}
                        <Link to="/register" className="text-primary hover:underline">
                            Register
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default Login;
