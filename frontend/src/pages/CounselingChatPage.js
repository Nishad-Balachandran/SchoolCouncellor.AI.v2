import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';
import { Send, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../contexts/authStore';
export const CounselingChatPage = () => {
    const navigate = useNavigate();
    const { user } = useAuthStore();
    const { sessionId } = useParams();
    const [messages, setMessages] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [session, setSession] = useState(null);
    useEffect(() => {
        if (sessionId) {
            loadSession();
            loadMessages();
        }
    }, [sessionId]);
    useEffect(() => {
        if (!sessionId)
            return;
        const interval = setInterval(() => {
            loadMessages();
        }, 3000);
        return () => clearInterval(interval);
    }, [sessionId]);
    const loadSession = async () => {
        try {
            const response = await api.getSession(sessionId);
            setSession(response.data);
        }
        catch (error) {
            console.error('Failed to load session:', error);
        }
    };
    const loadMessages = async () => {
        try {
            const response = await api.getMessages(sessionId);
            setMessages(response.data);
        }
        catch (error) {
            console.error('Failed to load messages:', error);
        }
    };
    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!inputValue.trim())
            return;
        setIsLoading(true);
        try {
            if (user?.role === 'counselor') {
                await api.addCounselorMessage(sessionId, inputValue);
            }
            else {
                await api.addMessage(sessionId, inputValue);
            }
            await loadMessages();
            setInputValue('');
        }
        catch (error) {
            console.error('Failed to send message:', error);
        }
        finally {
            setIsLoading(false);
        }
    };
    return (_jsxs("div", { className: "min-h-screen bg-gray-100 flex flex-col", children: [_jsx("header", { className: "bg-white shadow", children: _jsxs("div", { className: "max-w-4xl mx-auto px-4 py-4 flex items-center gap-4", children: [_jsx("button", { onClick: () => navigate('/counseling'), className: "text-blue-600 hover:text-blue-700", children: _jsx(ArrowLeft, { size: 24 }) }), _jsxs("div", { children: [_jsx("h1", { className: "text-2xl font-bold text-gray-900", children: user?.role === 'counselor' ? 'Counseling Session' : 'AI Counseling Session' }), _jsxs("p", { className: "text-gray-600 text-sm", children: ["Started at ", session?.createdAt
                                            ? new Date(session.createdAt).toLocaleString()
                                            : 'Just now'] }), session?.counselorId && (_jsx("p", { className: "text-xs text-emerald-700 mt-1", children: "Counselor assigned to this session" }))] })] }) }), _jsxs("main", { className: "flex-1 max-w-4xl mx-auto w-full px-4 py-8", children: [_jsx("div", { className: "bg-white rounded-lg shadow h-96 overflow-y-auto p-6 mb-4", children: _jsx("div", { className: "space-y-4", children: messages.length === 0 ? (_jsx("div", { className: "text-center text-gray-500 py-12", children: _jsx("p", { children: "Start typing to begin your counseling session" }) })) : (messages.map((msg) => (_jsx("div", { className: `flex ${(msg.role === 'user' && user?.role === 'student') ||
                                    (msg.role === 'counselor' && user?.role === 'counselor')
                                    ? 'justify-end'
                                    : 'justify-start'}`, children: _jsxs("div", { className: `max-w-xs px-4 py-2 rounded-lg ${msg.role === 'user'
                                        ? 'bg-blue-600 text-white'
                                        : msg.role === 'counselor'
                                            ? 'bg-emerald-600 text-white'
                                            : 'bg-gray-200 text-gray-900'}`, children: [_jsx("p", { className: "text-xs font-semibold opacity-80 mb-1", children: msg.role === 'user'
                                                ? 'Student'
                                                : msg.role === 'counselor'
                                                    ? 'Counselor'
                                                    : 'AI Counselor' }), _jsx("p", { children: msg.content }), _jsx("p", { className: "text-xs mt-1 opacity-70", children: new Date(msg.createdAt).toLocaleTimeString() })] }) }, msg.id)))) }) }), _jsxs("form", { onSubmit: handleSendMessage, className: "flex gap-2", children: [_jsx("input", { type: "text", value: inputValue, onChange: (e) => setInputValue(e.target.value), placeholder: "Type your message...", disabled: isLoading, className: "flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" }), _jsxs("button", { type: "submit", disabled: isLoading || !inputValue.trim(), className: "bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-6 py-2 rounded-lg flex items-center gap-2 transition", children: [_jsx(Send, { size: 20 }), "Send"] })] })] })] }));
};
