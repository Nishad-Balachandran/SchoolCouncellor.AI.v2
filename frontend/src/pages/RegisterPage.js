import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../contexts/authStore';
import api from '../services/api';
import toast from 'react-hot-toast';
import { ArrowLeft } from 'lucide-react';
export const RegisterPage = () => {
    const navigate = useNavigate();
    const { setUser, setToken } = useAuthStore();
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        firstName: '',
        lastName: '',
        role: 'student',
    });
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };
    const handleRegister = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const response = await api.register(formData);
            setUser(response.data.user);
            setToken(response.data.token);
            toast.success('Registration successful!');
            navigate('/dashboard');
        }
        catch (error) {
            toast.error(error.response?.data?.message || 'Registration failed. Please try again.');
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
        navigate('/login');
    };
    return (_jsx("div", { className: "min-h-screen bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center p-4", children: _jsxs("div", { className: "bg-white rounded-lg shadow-xl p-8 max-w-md w-full", children: [_jsxs("button", { onClick: handleBack, className: "text-blue-600 hover:text-blue-700 mb-4 inline-flex items-center gap-2", type: "button", children: [_jsx(ArrowLeft, { size: 18 }), "Back"] }), _jsx("h1", { className: "text-3xl font-bold text-gray-800 mb-2 text-center", children: "Register" }), _jsx("p", { className: "text-gray-600 text-center mb-6", children: "Create your account" }), _jsxs("form", { onSubmit: handleRegister, className: "space-y-4", children: [_jsxs("div", { className: "grid grid-cols-2 gap-3", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-gray-700 font-medium text-sm mb-1", children: "First Name" }), _jsx("input", { type: "text", name: "firstName", value: formData.firstName, onChange: handleChange, className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm", placeholder: "First name", required: true })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-gray-700 font-medium text-sm mb-1", children: "Last Name" }), _jsx("input", { type: "text", name: "lastName", value: formData.lastName, onChange: handleChange, className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm", placeholder: "Last name", required: true })] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-gray-700 font-medium mb-2", children: "Email" }), _jsx("input", { type: "email", name: "email", value: formData.email, onChange: handleChange, className: "w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500", placeholder: "Enter your email", required: true })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-gray-700 font-medium mb-2", children: "Role" }), _jsxs("select", { name: "role", value: formData.role, onChange: handleChange, className: "w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500", children: [_jsx("option", { value: "student", children: "Student" }), _jsx("option", { value: "counselor", children: "Counselor" }), _jsx("option", { value: "admin", children: "Admin" })] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-gray-700 font-medium mb-2", children: "Password" }), _jsx("input", { type: "password", name: "password", value: formData.password, onChange: handleChange, className: "w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500", placeholder: "Enter your password", required: true })] }), _jsx("button", { type: "submit", disabled: isLoading, className: "w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-2 px-4 rounded-lg transition", children: isLoading ? 'Registering...' : 'Register' })] }), _jsxs("p", { className: "text-center text-gray-600 mt-4", children: ["Already have an account?", ' ', _jsx("a", { href: "/login", className: "text-blue-600 hover:underline", children: "Login here" })] })] }) }));
};
