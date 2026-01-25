import { Zap, Search, Activity } from 'lucide-react';

const Navbar = () => {
    return (
        <nav className="border-b border-border bg-background/50 backdrop-blur-md sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Zap className="w-6 h-6 text-primary" />
                    <span className="font-bold text-xl tracking-tight text-white">
                        NEXUS<span className="text-primary">MARKET</span>
                    </span>
                </div>

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
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface border border-border">
                        <div className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                        </div>
                        <span className="text-xs font-medium text-zinc-400">Live Traffic</span>
                    </div>
                    <button className="p-2 hover:bg-surface rounded-full transition-colors relative">
                        <Activity className="w-5 h-5 text-zinc-400 hover:text-white" />
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
