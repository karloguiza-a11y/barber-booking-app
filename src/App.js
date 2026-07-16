import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useAuth } from './hooks/useAuth';
import { useBarbers } from './hooks/useBarbers';
import { useReviews } from './hooks/useReviews';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import HomePage from './pages/HomePage';
function App() {
    const { user, loading: authLoading } = useAuth();
    const [currentPage, setCurrentPage] = useState('home');
    const { barbers, loading: barbersLoading } = useBarbers();
    const { getBarberRating } = useReviews();
    if (authLoading) {
        return (_jsx("div", { className: "flex items-center justify-center h-screen bg-gradient-to-br from-dark-primary to-dark-secondary", children: _jsx("div", { className: "text-white", children: "Cargando..." }) }));
    }
    if (!user) {
        return (_jsxs("div", { className: "min-h-screen bg-gradient-to-br from-dark-primary to-dark-secondary", children: [currentPage === 'login' && (_jsx(LoginPage, { onSuccess: () => setCurrentPage('home'), onSwitchToRegister: () => setCurrentPage('register') })), currentPage === 'register' && (_jsx(RegisterPage, { onSuccess: () => setCurrentPage('home'), onSwitchToLogin: () => setCurrentPage('login') })), currentPage === 'home' && (_jsx(LoginPage, { onSuccess: () => setCurrentPage('home'), onSwitchToRegister: () => setCurrentPage('register') }))] }));
    }
    return (_jsx("div", { className: "min-h-screen bg-gradient-to-br from-dark-primary to-dark-secondary", children: _jsx(HomePage, { user: user, barbers: barbers, barbersLoading: barbersLoading, getBarberRating: getBarberRating }) }));
}
export default App;
