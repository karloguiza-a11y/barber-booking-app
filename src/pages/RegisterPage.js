import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
export default function RegisterPage({ onSuccess, onSwitchToLogin }) {
    const { signup, loading, error } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [localError, setLocalError] = useState(null);
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLocalError(null);
        if (password !== confirmPassword) {
            setLocalError('Las contraseñas no coinciden');
            return;
        }
        try {
            await signup(email, password, fullName);
            onSuccess();
        }
        catch (err) {
            console.error('Signup error:', err);
        }
    };
    return (_jsx("div", { className: "flex items-center justify-center min-h-screen", children: _jsxs("div", { className: "bg-dark-secondary p-8 rounded-lg shadow-lg w-96", children: [_jsx("h1", { className: "text-3xl font-bebas text-accent mb-6 text-center", children: "Crear Cuenta" }), _jsxs("form", { onSubmit: handleSubmit, children: [_jsxs("div", { className: "mb-4", children: [_jsx("label", { className: "block text-white mb-2", children: "Nombre Completo" }), _jsx("input", { type: "text", value: fullName, onChange: (e) => setFullName(e.target.value), className: "w-full px-4 py-2 bg-dark-tertiary text-white rounded border border-accent focus:outline-none focus:border-accent", required: true })] }), _jsxs("div", { className: "mb-4", children: [_jsx("label", { className: "block text-white mb-2", children: "Email" }), _jsx("input", { type: "email", value: email, onChange: (e) => setEmail(e.target.value), className: "w-full px-4 py-2 bg-dark-tertiary text-white rounded border border-accent focus:outline-none focus:border-accent", required: true })] }), _jsxs("div", { className: "mb-4", children: [_jsx("label", { className: "block text-white mb-2", children: "Contrase\u00F1a" }), _jsx("input", { type: "password", value: password, onChange: (e) => setPassword(e.target.value), className: "w-full px-4 py-2 bg-dark-tertiary text-white rounded border border-accent focus:outline-none focus:border-accent", required: true })] }), _jsxs("div", { className: "mb-6", children: [_jsx("label", { className: "block text-white mb-2", children: "Confirmar Contrase\u00F1a" }), _jsx("input", { type: "password", value: confirmPassword, onChange: (e) => setConfirmPassword(e.target.value), className: "w-full px-4 py-2 bg-dark-tertiary text-white rounded border border-accent focus:outline-none focus:border-accent", required: true })] }), error && _jsx("p", { className: "text-red-500 mb-4 text-sm", children: error }), localError && _jsx("p", { className: "text-red-500 mb-4 text-sm", children: localError }), _jsx("button", { type: "submit", disabled: loading, className: "w-full bg-accent text-dark-primary font-bold py-2 rounded hover:bg-opacity-80 disabled:opacity-50", children: loading ? 'Cargando...' : 'Registrarse' })] }), _jsxs("p", { className: "text-white text-center mt-4", children: ["\u00BFYa tienes cuenta?", ' ', _jsx("button", { onClick: onSwitchToLogin, className: "text-accent hover:underline font-bold", children: "Inicia sesi\u00F3n" })] })] }) }));
}
