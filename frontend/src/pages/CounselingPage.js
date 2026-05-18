import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../contexts/authStore';
import api from '../services/api';
import { Plus, MessageCircle, Loader, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
export const CounselingPage = () => {
    const navigate = useNavigate();
    const { user } = useAuthStore();
    const [sessions, setSessions] = useState([]);
    const [queueSessions, setQueueSessions] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
        loadSessions();
    }, []);
    const loadSessions = async () => {
        try {
            const [sessionsResponse, queueResponse] = await Promise.all([
                api.getSessions(),
                user?.role === 'counselor'
                    ? api.getCounselorQueueSessions()
                    : Promise.resolve({ data: [] }),
            ]);
            setSessions(sessionsResponse.data);
            setQueueSessions(queueResponse.data);
        }
        catch (error) {
            console.error('Failed to load sessions:', error);
        }
        finally {
            setIsLoading(false);
        }
    };
    const handleCreateSession = async () => {
        try {
            const response = await api.createSession();
            navigate(`/counseling/${response.data.id}`);
        }
        catch (error) {
            console.error('Failed to create session:', error);
        }
    };
    const handleClaimSession = async (sessionId) => {
        try {
            await api.claimSession(sessionId);
            toast.success('Session claimed successfully');
            await loadSessions();
            navigate(`/counseling/${sessionId}`);
        }
        catch (error) {
            console.error('Failed to claim session:', error);
            toast.error('Unable to claim session');
        }
    };
    return (_jsxs("div", { className: "min-h-screen bg-gray-100", children: [_jsx("header", { className: "bg-white shadow", children: _jsx("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4", children: _jsxs("div", { className: "flex justify-between items-center", children: [_jsxs("div", { className: "flex items-start gap-3", children: [_jsx("button", { onClick: () => navigate('/dashboard'), className: "mt-1 text-blue-600 hover:text-blue-700", "aria-label": "Back to dashboard", children: _jsx(ArrowLeft, { size: 22 }) }), _jsxs("div", { children: [_jsx("h1", { className: "text-2xl font-bold text-gray-900", children: "Counseling Sessions" }), _jsx("p", { className: "text-gray-600", children: user?.role === 'counselor'
                                                    ? 'Review and respond to assigned student sessions'
                                                    : 'Talk to your AI counselor anytime' })] })] }), user?.role === 'student' && (_jsxs("button", { onClick: handleCreateSession, className: "bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2", children: [_jsx(Plus, { size: 20 }), "New Session"] }))] }) }) }), _jsx("main", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8", children: isLoading ? (_jsxs("div", { className: "text-center py-12", children: [_jsx(Loader, { className: "animate-spin mx-auto mb-4", size: 40 }), _jsx("p", { className: "text-gray-600", children: "Loading sessions..." })] })) : sessions.length === 0 && !(user?.role === 'counselor' && queueSessions.length > 0) ? (_jsxs("div", { className: "bg-white rounded-lg shadow p-12 text-center", children: [_jsx(MessageCircle, { className: "mx-auto mb-4 text-gray-400", size: 48 }), _jsx("h2", { className: "text-xl font-bold text-gray-900 mb-2", children: "No sessions yet" }), _jsx("p", { className: "text-gray-600 mb-6", children: user?.role === 'student'
                                ? 'Start your first counseling session with our AI counselor'
                                : 'No assigned sessions yet' }), user?.role === 'student' && (_jsxs("button", { onClick: handleCreateSession, className: "bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg inline-flex items-center gap-2", children: [_jsx(Plus, { size: 20 }), "Start First Session"] }))] })) : (_jsxs("div", { className: "space-y-8", children: [user?.role === 'counselor' && queueSessions.length > 0 && (_jsxs("section", { children: [_jsx("h2", { className: "text-lg font-semibold text-gray-900 mb-4", children: "Unassigned Sessions" }), _jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6", children: queueSessions.map((session) => (_jsxs("div", { className: "bg-white rounded-lg shadow p-6", children: [_jsxs("div", { className: "flex items-start justify-between mb-4", children: [_jsxs("h3", { className: "text-lg font-bold text-gray-900", children: ["Session ", session.id.slice(0, 8)] }), _jsx("span", { className: "px-3 py-1 rounded-full text-sm font-medium bg-amber-100 text-amber-800", children: "Unassigned" })] }), _jsxs("p", { className: "text-gray-600 text-sm mb-2", children: ["Student: ", session.student?.firstName, " ", session.student?.lastName] }), _jsxs("p", { className: "text-gray-500 text-xs mb-4", children: ["Started ", new Date(session.createdAt).toLocaleDateString()] }), _jsx("button", { onClick: () => handleClaimSession(session.id), className: "w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg", children: "Claim Session" })] }, session.id))) })] })), _jsxs("section", { children: [_jsx("h2", { className: "text-lg font-semibold text-gray-900 mb-4", children: user?.role === 'counselor' ? 'My Claimed Sessions' : 'My Sessions' }), _jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6", children: sessions.map((session) => (_jsxs("div", { className: "bg-white rounded-lg shadow hover:shadow-lg transition cursor-pointer p-6", onClick: () => navigate(`/counseling/${session.id}`), children: [_jsxs("div", { className: "flex items-start justify-between mb-4", children: [_jsxs("h3", { className: "text-lg font-bold text-gray-900", children: ["Session ", session.id.slice(0, 8)] }), _jsx("span", { className: `px-3 py-1 rounded-full text-sm font-medium ${session.status === 'active'
                                                            ? 'bg-green-100 text-green-800'
                                                            : 'bg-gray-100 text-gray-800'}`, children: session.status })] }), _jsxs("p", { className: "text-gray-600 text-sm mb-2", children: ["Messages: ", session.messages?.length || 0] }), user?.role === 'counselor' && session.student && (_jsxs("p", { className: "text-gray-600 text-sm mb-2", children: ["Student: ", session.student.firstName, " ", session.student.lastName] })), _jsxs("p", { className: "text-gray-500 text-xs", children: ["Started ", new Date(session.createdAt).toLocaleDateString()] }), session.summary && (_jsx("p", { className: "mt-3 text-sm text-gray-700 line-clamp-2", children: session.summary }))] }, session.id))) })] })] })) })] }));
};
