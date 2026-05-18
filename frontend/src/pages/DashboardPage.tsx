import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../contexts/authStore';
import api from '../services/api';
import { MessageCircle, Calendar, BarChart3, LogOut } from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const response = await api.getDashboardStats();
      setStats(response.data);
    } catch (error) {
      console.error('Failed to load stats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Welcome, {user?.firstName}!
              </h1>
              <p className="text-gray-600 capitalize">
                {user?.role} Dashboard
              </p>
            </div>
            <button
              onClick={logout}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
            >
              <LogOut size={20} />
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isLoading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin">
              <div className="w-12 h-12 border-4 border-gray-300 border-t-blue-600 rounded-full"></div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Stats Cards */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 font-medium">Total Sessions</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {stats?.totalSessions || 0}
                  </p>
                </div>
                <MessageCircle className="text-blue-600" size={40} />
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 font-medium">Active Sessions</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {stats?.activeSessions || 0}
                  </p>
                </div>
                <Calendar className="text-green-600" size={40} />
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 font-medium">Completion Rate</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {stats?.completionRate || 0}%
                  </p>
                </div>
                <BarChart3 className="text-purple-600" size={40} />
              </div>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Quick Actions
            </h2>
            <div className="space-y-3">
              {user?.role === 'student' && (
                <>
                  <button
                    onClick={() => navigate('/counseling')}
                    className="w-full block bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg text-center font-medium transition"
                  >
                    Start AI Counseling Session
                  </button>
                  <button
                    onClick={() => navigate('/appointments')}
                    className="w-full block bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-lg text-center font-medium transition"
                  >
                    Schedule Appointment
                  </button>
                  <button
                    onClick={() => navigate('/analytics')}
                    className="w-full block bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-3 rounded-lg text-center font-medium transition"
                  >
                    My Progress Analytics
                  </button>
                </>
              )}

              {user?.role === 'counselor' && (
                <>
                  <button
                    onClick={() => navigate('/counseling')}
                    className="w-full block bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg text-center font-medium transition"
                  >
                    Manage Counseling Queue
                  </button>
                  <button
                    onClick={() => navigate('/appointments')}
                    className="w-full block bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-lg text-center font-medium transition"
                  >
                    View Appointments
                  </button>
                  <button
                    onClick={() => navigate('/analytics')}
                    className="w-full block bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-3 rounded-lg text-center font-medium transition"
                  >
                    Counselor Insights
                  </button>
                </>
              )}

              {user?.role === 'admin' && (
                <>
                  <button
                    onClick={() => navigate('/admin')}
                    className="w-full block bg-slate-700 hover:bg-slate-800 text-white px-4 py-3 rounded-lg text-center font-medium transition"
                  >
                    Open Admin Console
                  </button>
                  <button
                    onClick={() => navigate('/analytics')}
                    className="w-full block bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-3 rounded-lg text-center font-medium transition"
                  >
                    Platform Analytics
                  </button>
                  <button
                    onClick={() => navigate('/counseling')}
                    className="w-full block bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg text-center font-medium transition"
                  >
                    Review Sessions
                  </button>
                </>
              )}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Profile Information
            </h2>
            <div className="space-y-2 text-gray-700">
              <p>
                <strong>Name:</strong> {user?.firstName} {user?.lastName}
              </p>
              <p>
                <strong>Email:</strong> {user?.email}
              </p>
              <p>
                <strong>Role:</strong> {user?.role?.toUpperCase()}
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
