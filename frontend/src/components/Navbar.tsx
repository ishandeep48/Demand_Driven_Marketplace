import { Zap, Search, User, LogOut } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const { user, isAuthenticated, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="border-b border-border bg-background/50 backdrop-blur-md sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                <Link to="/" className="flex items-center gap-2">
                    <Zap className="w-6 h-6 text-primary" />
                    <span className="font-bold text-xl tracking-tight text-white">
                        NEXUS<span className="text-primary">MARKET</span>
                    </span>
                </Link>

                <div className="flex-1 max-w-md mx-8 hidden md:block">
                    <div className="relative group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 group-focus-within:text-primary transition-colors" />
                        <input
                            type="text"
                            placeholder="Search for GPUs, CPUs..."
                            className="w-full bg-surface border border-border rounded-full py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all placeholder:text-zinc-600"
                        />
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface border border-border">
                        <div className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                        </div>
                        <span className="text-xs font-medium text-zinc-400">Live Traffic</span>
                    </div>

                    {isAuthenticated ? (
                        <div className="flex items-center gap-4">
                            <Link to="/profile" className="text-sm font-medium text-zinc-300 hover:text-white flex items-center gap-2">
                                <User size={18} />
                                <span className="hidden sm:inline">{user?.name}</span>
                            </Link>
                            <button onClick={handleLogout} className="text-zinc-400 hover:text-rose-500 transition-colors">
                                <LogOut size={18} />
                            </button>
                        </div>
                    ) : (
                        <div className="flex items-center gap-3">
                            <Link to="/login" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">
                                Login
                            </Link>
                            <Link to="/register" className="text-sm font-bold text-black bg-primary px-4 py-2 rounded-full hover:bg-primary/90 transition-colors">
                                Register
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
