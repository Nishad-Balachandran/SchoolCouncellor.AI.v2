import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Trash2, Users, UserCheck, GraduationCap, Shield } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../services/api';
import { useAuthStore } from '../contexts/authStore';
export const AdminPage = () => {
    const navigate = useNavigate();
    const { user } = useAuthStore();
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const loadUsers = async () => {
        try {
            const response = await api.getUsers();
            setUsers(response.data);
        }
        catch (error) {
            toast.error('Failed to load users');
        }
        finally {
            setIsLoading(false);
        }
    };
    useEffect(() => {
        loadUsers();
    }, []);
    const stats = useMemo(() => {
        const total = users.length;
        const students = users.filter((u) => u.role === 'student').length;
        const counselors = users.filter((u) => u.role === 'counselor').length;
        const admins = users.filter((u) => u.role === 'admin').length;
        return { total, students, counselors, admins };
    }, [users]);
    const handleDeleteUser = async (id, name) => {
        if (!window.confirm(`Delete ${name}? This action cannot be undone.`)) {
            return;
        }
        try {
            await api.deleteUser(id);
            toast.success('User deleted');
            setUsers((prev) => prev.filter((item) => item.id !== id));
        }
        catch (error) {
            toast.error(error?.response?.data?.message || 'Failed to delete user');
        }
    };
    return (_jsxs("div", { className: "min-h-screen bg-gray-100", children: [_jsx("header", { className: "bg-white shadow", children: _jsx("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4", children: _jsx("div", { className: "flex items-center justify-between", children: _jsxs("div", { className: "flex items-start gap-3", children: [_jsx("button", { onClick: () => navigate('/dashboard'), className: "mt-1 text-blue-600 hover:text-blue-700", "aria-label": "Back to dashboard", children: _jsx(ArrowLeft, { size: 22 }) }), _jsxs("div", { children: [_jsx("h1", { className: "text-2xl font-bold text-gray-900", children: "Admin Console" }), _jsx("p", { className: "text-gray-600", children: "Manage users and platform access" })] })] }) }) }) }), _jsxs("main", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8", children: [_jsxs("div", { className: "grid grid-cols-1 md:grid-cols-4 gap-4 mb-8", children: [_jsxs("div", { className: "bg-white rounded-lg shadow p-5 flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("p", { className: "text-sm text-gray-500", children: "Total Users" }), _jsx("p", { className: "text-2xl font-bold text-gray-900", children: stats.total })] }), _jsx(Users, { className: "text-blue-600" })] }), _jsxs("div", { className: "bg-white rounded-lg shadow p-5 flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("p", { className: "text-sm text-gray-500", children: "Students" }), _jsx("p", { className: "text-2xl font-bold text-gray-900", children: stats.students })] }), _jsx(GraduationCap, { className: "text-green-600" })] }), _jsxs("div", { className: "bg-white rounded-lg shadow p-5 flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("p", { className: "text-sm text-gray-500", children: "Counselors" }), _jsx("p", { className: "text-2xl font-bold text-gray-900", children: stats.counselors })] }), _jsx(UserCheck, { className: "text-amber-600" })] }), _jsxs("div", { className: "bg-white rounded-lg shadow p-5 flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("p", { className: "text-sm text-gray-500", children: "Admins" }), _jsx("p", { className: "text-2xl font-bold text-gray-900", children: stats.admins })] }), _jsx(Shield, { className: "text-purple-600" })] })] }), _jsxs("div", { className: "bg-white rounded-lg shadow", children: [_jsx("div", { className: "border-b border-gray-100 px-6 py-4", children: _jsx("h2", { className: "text-lg font-semibold text-gray-900", children: "User Directory" }) }), isLoading ? (_jsx("p", { className: "px-6 py-8 text-gray-600", children: "Loading users..." })) : users.length === 0 ? (_jsx("p", { className: "px-6 py-8 text-gray-600", children: "No users found." })) : (_jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "min-w-full text-sm", children: [_jsx("thead", { className: "bg-gray-50", children: _jsxs("tr", { children: [_jsx("th", { className: "text-left px-6 py-3 font-semibold text-gray-700", children: "Name" }), _jsx("th", { className: "text-left px-6 py-3 font-semibold text-gray-700", children: "Email" }), _jsx("th", { className: "text-left px-6 py-3 font-semibold text-gray-700", children: "Role" }), _jsx("th", { className: "text-right px-6 py-3 font-semibold text-gray-700", children: "Action" })] }) }), _jsx("tbody", { children: users.map((item) => {
                                                const isCurrentUser = item.id === user?.id;
                                                return (_jsxs("tr", { className: "border-t border-gray-100", children: [_jsxs("td", { className: "px-6 py-3 text-gray-900", children: [item.firstName, " ", item.lastName] }), _jsx("td", { className: "px-6 py-3 text-gray-700", children: item.email }), _jsx("td", { className: "px-6 py-3", children: _jsx("span", { className: "capitalize px-3 py-1 rounded-full bg-gray-100 text-gray-700", children: item.role }) }), _jsx("td", { className: "px-6 py-3 text-right", children: _jsxs("button", { onClick: () => handleDeleteUser(item.id, `${item.firstName} ${item.lastName}`), disabled: isCurrentUser, className: "inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-red-600 hover:bg-red-700 text-white disabled:bg-gray-300", children: [_jsx(Trash2, { size: 15 }), "Delete"] }) })] }, item.id));
                                            }) })] }) }))] })] })] }));
};
