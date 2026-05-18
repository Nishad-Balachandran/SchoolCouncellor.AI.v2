import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { Calendar, Clock, Trash2, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
export const AppointmentsPage = () => {
    const navigate = useNavigate();
    const [appointments, setAppointments] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [counselors, setCounselors] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        counselorId: '',
        scheduledTime: '',
    });
    useEffect(() => {
        loadData();
    }, []);
    const loadData = async () => {
        try {
            const [appointmentsRes, counselorsRes] = await Promise.all([
                api.getAppointments(),
                api.getCounselors(),
            ]);
            setAppointments(appointmentsRes.data);
            setCounselors(counselorsRes.data);
        }
        catch (error) {
            console.error('Failed to load data:', error);
            toast.error('Failed to load appointments');
        }
        finally {
            setIsLoading(false);
        }
    };
    const handleCreateAppointment = async (e) => {
        e.preventDefault();
        try {
            await api.createAppointment(formData.counselorId, new Date(formData.scheduledTime));
            toast.success('Appointment created successfully');
            setShowForm(false);
            setFormData({ counselorId: '', scheduledTime: '' });
            loadData();
        }
        catch (error) {
            toast.error(error.response?.data?.message ||
                'Failed to create appointment');
        }
    };
    const handleCancelAppointment = async (id) => {
        try {
            await api.cancelAppointment(id);
            toast.success('Appointment cancelled');
            loadData();
        }
        catch (error) {
            toast.error('Failed to cancel appointment');
        }
    };
    return (_jsxs("div", { className: "min-h-screen bg-gray-100", children: [_jsx("header", { className: "bg-white shadow", children: _jsx("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4", children: _jsxs("div", { className: "flex justify-between items-center", children: [_jsxs("div", { className: "flex items-start gap-3", children: [_jsx("button", { onClick: () => navigate('/dashboard'), className: "mt-1 text-blue-600 hover:text-blue-700", "aria-label": "Back to dashboard", children: _jsx(ArrowLeft, { size: 22 }) }), _jsxs("div", { children: [_jsx("h1", { className: "text-2xl font-bold text-gray-900", children: "Appointments" }), _jsx("p", { className: "text-gray-600", children: "Schedule and manage counselor appointments" })] })] }), _jsx("button", { onClick: () => setShowForm(!showForm), className: "bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg", children: showForm ? 'Cancel' : '+ New Appointment' })] }) }) }), _jsxs("main", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8", children: [showForm && (_jsxs("div", { className: "bg-white rounded-lg shadow p-6 mb-8", children: [_jsx("h2", { className: "text-xl font-bold mb-4", children: "Schedule Appointment" }), _jsxs("form", { onSubmit: handleCreateAppointment, className: "space-y-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-gray-700 font-medium mb-2", children: "Select Counselor" }), _jsxs("select", { value: formData.counselorId, onChange: (e) => setFormData((prev) => ({
                                                    ...prev,
                                                    counselorId: e.target.value,
                                                })), className: "w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500", required: true, children: [_jsx("option", { value: "", children: "Choose a counselor..." }), counselors.map((c) => (_jsxs("option", { value: c.id, children: [c.firstName, " ", c.lastName] }, c.id)))] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-gray-700 font-medium mb-2", children: "Date & Time" }), _jsx("input", { type: "datetime-local", value: formData.scheduledTime, onChange: (e) => setFormData((prev) => ({
                                                    ...prev,
                                                    scheduledTime: e.target.value,
                                                })), className: "w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500", required: true })] }), _jsx("button", { type: "submit", className: "w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg", children: "Schedule Appointment" })] })] })), isLoading ? (_jsx("div", { className: "text-center py-12", children: _jsx("p", { className: "text-gray-600", children: "Loading appointments..." }) })) : appointments.length === 0 ? (_jsxs("div", { className: "bg-white rounded-lg shadow p-12 text-center", children: [_jsx(Calendar, { className: "mx-auto mb-4 text-gray-400", size: 48 }), _jsx("h2", { className: "text-xl font-bold text-gray-900 mb-2", children: "No appointments yet" }), _jsx("p", { className: "text-gray-600", children: "Schedule an appointment with a counselor" })] })) : (_jsx("div", { className: "space-y-4", children: appointments.map((apt) => (_jsxs("div", { className: "bg-white rounded-lg shadow p-6 flex justify-between items-center", children: [_jsxs("div", { children: [_jsxs("h3", { className: "text-lg font-bold text-gray-900", children: [apt.counselor?.firstName, " ", apt.counselor?.lastName] }), _jsxs("div", { className: "mt-2 space-y-1 text-gray-600 text-sm", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Calendar, { size: 16 }), new Date(apt.scheduledTime).toLocaleDateString()] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Clock, { size: 16 }), new Date(apt.scheduledTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })] })] }), _jsx("span", { className: `mt-2 inline-block px-3 py-1 rounded-full text-sm font-medium ${apt.status === 'scheduled'
                                                ? 'bg-blue-100 text-blue-800'
                                                : apt.status === 'completed'
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-red-100 text-red-800'}`, children: apt.status })] }), apt.status === 'scheduled' && (_jsx("button", { onClick: () => handleCancelAppointment(apt.id), className: "bg-red-600 hover:bg-red-700 text-white p-2 rounded-lg", children: _jsx(Trash2, { size: 20 }) }))] }, apt.id))) }))] })] }));
};
