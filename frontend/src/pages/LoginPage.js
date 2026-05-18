import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../contexts/authStore';
import api from '../services/api';
import toast from 'react-hot-toast';
import { ArrowLeft } from 'lucide-react';
export const LoginPage = () => {
    const navigate = useNavigate();
    const { setUser, setToken } = useAuthStore();
    const [isLoading, setIsLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const handleLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const response = await api.login(email, password);
            setUser(response.data.user);
            setToken(response.data.token);
            toast.success('Login successful!');
            navigate('/dashboard');
        }
        catch (error) {
            toast.error(error.response?.data?.message || 'Login failed. Please try again.');
        }
        finally {
            setIsLoading(false);
        }
    };
    const handleBack = () => {
        if (window.history.length > 1) {
            navigate(-1);
            return;
        }
        navigate('/register');
    };
    return (_jsx("div", { className: "min-h-screen bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center p-4", children: _jsxs("div", { className: "bg-white rounded-lg shadow-xl p-8 max-w-md w-full", children: [_jsxs("button", { onClick: handleBack, className: "text-blue-600 hover:text-blue-700 mb-4 inline-flex items-center gap-2", type: "button", children: [_jsx(ArrowLeft, { size: 18 }), "Back"] }), _jsx("h1", { className: "text-3xl font-bold text-gray-800 mb-2 text-center", children: "School Counselor AI" }), _jsx("p", { className: "text-gray-600 text-center mb-6", children: "Your AI-powered counseling companion" }), _jsxs("form", { onSubmit: handleLogin, className: "space-y-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-gray-700 font-medium mb-2", children: "Email" }), _jsx("input", { type: "email", value: email, onChange: (e) => setEmail(e.target.value), className: "w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500", placeholder: "Enter your email", required: true })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-gray-700 font-medium mb-2", children: "Password" }), _jsx("input", { type: "password", value: password, onChange: (e) => setPassword(e.target.value), className: "w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500", placeholder: "Enter your password", required: true })] }), _jsx("button", { type: "submit", disabled: isLoading, className: "w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-2 px-4 rounded-lg transition", children: isLoading ? 'Logging in...' : 'Login' })] }), _jsxs("p", { className: "text-center text-gray-600 mt-4", children: ["Don't have an account?", ' ', _jsx("a", { href: "/register", className: "text-blue-600 hover:underline", children: "Register here" })] }), _jsx("div", { className: "mt-6 p-4 bg-blue-50 rounded-lg", children: _jsxs("p", { className: "text-sm text-gray-700", children: [_jsx("strong", { children: "Demo Credentials:" }), _jsx("br", {}), "Student: student@school.com / password123", _jsx("br", {}), "Counselor: counselor@school.com / password123", _jsx("br", {}), "Admin: admin@school.com / password123"] }) })] }) }));
};
