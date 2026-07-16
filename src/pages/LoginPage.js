import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
export default function LoginPage({ onSuccess, onSwitchToRegister }) {
    const { login, loading, error } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await login(email, password);
            onSuccess();
        }
        catch (err) {
            console.error('Login error:', err);
        }
    };
    return (_jsx("div", { className: "flex items-center justify-center min-h-screen", children: _jsxs("div", { className: "bg-dark-secondary p-8 rounded-lg shadow-lg w-96", children: [_jsx("h1", { className: "text-3xl font-bebas text-accent mb-6 text-center", children: "Barber Booking" }), _jsxs("form", { onSubmit: handleSubmit, children: [_jsxs("div", { className: "mb-4", children: [_jsx("label", { className: "block text-white mb-2", children: "Email" }), _jsx("input", { type: "email", value: email, onChange: (e) => setEmail(e.target.value), className: "w-full px-4 py-2 bg-dark-tertiary text-white rounded border border-accent focus:outline-none focus:border-accent", required: true })] }), _jsxs("div", { className: "mb-6", children: [_jsx("label", { className: "block text-white mb-2", children: "Contrase\u00F1a" }), _jsx("input", { type: "password", value: password, onChange: (e) => setPassword(e.target.value), className: "w-full px-4 py-2 bg-dark-tertiary text-white rounded border border-accent focus:outline-none focus:border-accent", required: true })] }), error && _jsx("p", { className: "text-red-500 mb-4 text-sm", children: error }), _jsx("button", { type: "submit", disabled: loading, className: "w-full bg-accent text-dark-primary font-bold py-2 rounded hover:bg-opacity-80 disabled:opacity-50", children: loading ? 'Cargando...' : 'Ingresar' })] }), _jsxs("p", { className: "text-white text-center mt-4", children: ["\u00BFNo tienes cuenta?", ' ', _jsx("button", { onClick: onSwitchToRegister, className: "text-accent hover:underline font-bold", children: "Reg\u00EDstrate" })] })] }) }));
}
