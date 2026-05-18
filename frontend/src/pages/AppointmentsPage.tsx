import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { Calendar, Clock, Trash2, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';

export const AppointmentsPage: React.FC = () => {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [counselors, setCounselors] = useState<any[]>([]);
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
    } catch (error) {
      console.error('Failed to load data:', error);
      toast.error('Failed to load appointments');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateAppointment = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.createAppointment(
        formData.counselorId,
        new Date(formData.scheduledTime),
      );
      toast.success('Appointment created successfully');
      setShowForm(false);
      setFormData({ counselorId: '', scheduledTime: '' });
      loadData();
    } catch (error: any) {
      toast.error(
        error.response?.data?.message ||
          'Failed to create appointment',
      );
    }
  };

  const handleCancelAppointment = async (id: string) => {
    try {
      await api.cancelAppointment(id);
      toast.success('Appointment cancelled');
      loadData();
    } catch (error) {
      toast.error('Failed to cancel appointment');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-start gap-3">
              <button
                onClick={() => navigate('/dashboard')}
                className="mt-1 text-blue-600 hover:text-blue-700"
                aria-label="Back to dashboard"
              >
                <ArrowLeft size={22} />
              </button>
              <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Appointments
              </h1>
              <p className="text-gray-600">
                Schedule and manage counselor appointments
              </p>
              </div>
            </div>
            <button
              onClick={() => setShowForm(!showForm)}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
            >
              {showForm ? 'Cancel' : '+ New Appointment'}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {showForm && (
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <h2 className="text-xl font-bold mb-4">Schedule Appointment</h2>
            <form onSubmit={handleCreateAppointment} className="space-y-4">
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Select Counselor
                </label>
                <select
                  value={formData.counselorId}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      counselorId: e.target.value,
                    }))
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                >
                  <option value="">Choose a counselor...</option>
                  {counselors.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.firstName} {c.lastName}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Date & Time
                </label>
                <input
                  type="datetime-local"
                  value={formData.scheduledTime}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      scheduledTime: e.target.value,
                    }))
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg"
              >
                Schedule Appointment
              </button>
            </form>
          </div>
        )}

        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Loading appointments...</p>
          </div>
        ) : appointments.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <Calendar className="mx-auto mb-4 text-gray-400" size={48} />
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              No appointments yet
            </h2>
            <p className="text-gray-600">
              Schedule an appointment with a counselor
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {appointments.map((apt) => (
              <div
                key={apt.id}
                className="bg-white rounded-lg shadow p-6 flex justify-between items-center"
              >
                <div>
                  <h3 className="text-lg font-bold text-gray-900">
                    {apt.counselor?.firstName} {apt.counselor?.lastName}
                  </h3>
                  <div className="mt-2 space-y-1 text-gray-600 text-sm">
                    <div className="flex items-center gap-2">
                      <Calendar size={16} />
                      {new Date(apt.scheduledTime).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock size={16} />
                      {new Date(apt.scheduledTime).toLocaleTimeString(
                        [],
                        { hour: '2-digit', minute: '2-digit' },
                      )}
                    </div>
                  </div>
                  <span
                    className={`mt-2 inline-block px-3 py-1 rounded-full text-sm font-medium ${
                      apt.status === 'scheduled'
                        ? 'bg-blue-100 text-blue-800'
                        : apt.status === 'completed'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {apt.status}
                  </span>
                </div>

                {apt.status === 'scheduled' && (
                  <button
                    onClick={() => handleCancelAppointment(apt.id)}
                    className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-lg"
                  >
                    <Trash2 size={20} />
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};
