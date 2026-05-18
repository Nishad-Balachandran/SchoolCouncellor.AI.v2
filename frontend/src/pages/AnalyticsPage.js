import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, BarChart3, Calendar, CheckCircle2, Clock3 } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../services/api';
import { useAuthStore } from '../contexts/authStore';
export const AnalyticsPage = () => {
    const navigate = useNavigate();
    const { user } = useAuthStore();
    const [dashboardStats, setDashboardStats] = useState(null);
    const [roleStats, setRoleStats] = useState(null);
    const [trends, setTrends] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const loadAnalytics = async () => {
        try {
            const roleAnalyticsPromise = user?.role === 'student'
                ? api.getStudentAnalytics()
                : user?.role === 'counselor'
                    ? api.getCounselorAnalytics()
                    : api.getDashboardStats();
            const [dashboardRes, roleRes, trendsRes] = await Promise.all([
                api.getDashboardStats(),
                roleAnalyticsPromise,
                api.getMonthlyTrends(),
            ]);
            setDashboardStats(dashboardRes.data);
            setRoleStats(roleRes.data);
            setTrends(trendsRes.data || {});
        }
        catch (error) {
            toast.error('Failed to load analytics');
        }
        finally {
            setIsLoading(false);
        }
    };
    useEffect(() => {
        loadAnalytics();
    }, []);
    const trendRows = useMemo(() => Object.entries(trends).sort(([a], [b]) => a.localeCompare(b)), [trends]);
    const cards = [
        {
            title: 'Total Sessions',
            value: roleStats?.totalSessions ?? dashboardStats?.totalSessions ?? 0,
            icon: _jsx(BarChart3, { className: "text-blue-600", size: 24 }),
        },
        {
            title: 'Active Sessions',
            value: roleStats?.activeSessions ?? dashboardStats?.activeSessions ?? 0,
            icon: _jsx(Clock3, { className: "text-amber-600", size: 24 }),
        },
        {
            title: 'Completed Sessions',
            value: roleStats?.completedSessions ?? dashboardStats?.completedSessions ?? 0,
            icon: _jsx(CheckCircle2, { className: "text-green-600", size: 24 }),
        },
        {
            title: 'Completion Rate',
            value: `${roleStats?.completionRate ?? dashboardStats?.completionRate ?? 0}%`,
            icon: _jsx(Calendar, { className: "text-purple-600", size: 24 }),
        },
    ];
    return (_jsxs("div", { className: "min-h-screen bg-gray-100", children: [_jsx("header", { className: "bg-white shadow", children: _jsx("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4", children: _jsxs("div", { className: "flex items-center gap-3", children: [_jsx("button", { onClick: () => navigate('/dashboard'), className: "text-blue-600 hover:text-blue-700", "aria-label": "Back to dashboard", children: _jsx(ArrowLeft, { size: 22 }) }), _jsxs("div", { children: [_jsx("h1", { className: "text-2xl font-bold text-gray-900", children: "Analytics" }), _jsxs("p", { className: "text-gray-600 capitalize", children: ["Insights for ", user?.role || 'user'] })] })] }) }) }), _jsx("main", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8", children: isLoading ? (_jsx("p", { className: "text-gray-600", children: "Loading analytics..." })) : (_jsxs(_Fragment, { children: [_jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-8", children: cards.map((card) => (_jsxs("div", { className: "bg-white rounded-lg shadow p-5 flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("p", { className: "text-sm text-gray-500", children: card.title }), _jsx("p", { className: "text-2xl font-bold text-gray-900", children: card.value })] }), card.icon] }, card.title))) }), _jsxs("div", { className: "bg-white rounded-lg shadow", children: [_jsx("div", { className: "px-6 py-4 border-b border-gray-100", children: _jsx("h2", { className: "text-lg font-semibold text-gray-900", children: "Monthly Session Trends" }) }), trendRows.length === 0 ? (_jsx("p", { className: "px-6 py-8 text-gray-600", children: "No trend data available yet." })) : (_jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "min-w-full text-sm", children: [_jsx("thead", { className: "bg-gray-50", children: _jsxs("tr", { children: [_jsx("th", { className: "text-left px-6 py-3 font-semibold text-gray-700", children: "Month" }), _jsx("th", { className: "text-left px-6 py-3 font-semibold text-gray-700", children: "Sessions" })] }) }), _jsx("tbody", { children: trendRows.map(([month, count]) => (_jsxs("tr", { className: "border-t border-gray-100", children: [_jsx("td", { className: "px-6 py-3 text-gray-900", children: month }), _jsx("td", { className: "px-6 py-3 text-gray-900", children: count })] }, month))) })] }) }))] })] })) })] }));
};
