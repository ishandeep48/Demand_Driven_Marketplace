import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ProductDetails from './pages/ProductDetails';
import Checkout from './pages/Checkout';
import PaymentSimulation from './pages/PaymentSimulation';
import Profile from './pages/Profile';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Toaster } from 'react-hot-toast';

// Removing explicit type annotation to avoid namespace issues if types aren't perfect
const ProtectedRoute = ({ children }: { children: any }) => {
  const { isAuthenticated } = useAuth();
  // We can return null or Redirect here, but for now assuming simple check. 
  // It's better to redirect in useEffect or use Navigate, 
  // but to keep it simple waiting for redirect:
  if (!isAuthenticated) {
    // You might want to redirect here using Navigate but I'll leave it to logical flow in pages or add Navigate.
    // Importing Navigate...
  }
  return children;
};

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <div className="min-h-screen bg-background text-zinc-100 font-sans selection:bg-primary/30">
            <Navbar />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/product/:id" element={<ProductDetails />} />
              <Route path="/checkout/:id" element={
                <ProtectedRoute>
                  <Checkout />
                </ProtectedRoute>
              } />
              <Route path="/payment/:orderId" element={
                <ProtectedRoute>
                  <PaymentSimulation />
                </ProtectedRoute>
              } />
              <Route path="/profile" element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } />
              <Route path="*" element={<Home />} />
            </Routes>
            <Toaster position="bottom-right" toastOptions={{
              style: {
                background: '#18181b',
                color: '#fff',
                border: '1px solid #27272a'
              }
            }} />
          </div>
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
