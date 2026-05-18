import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, BarChart3, Calendar, CheckCircle2, Clock3 } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../services/api';
import { useAuthStore } from '../contexts/authStore';

export const AnalyticsPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const [dashboardStats, setDashboardStats] = useState<any>(null);
  const [roleStats, setRoleStats] = useState<any>(null);
  const [trends, setTrends] = useState<Record<string, number>>({});
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
    } catch (error) {
      toast.error('Failed to load analytics');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAnalytics();
  }, []);

  const trendRows = useMemo(
    () => Object.entries(trends).sort(([a], [b]) => a.localeCompare(b)),
    [trends],
  );

  const cards = [
    {
      title: 'Total Sessions',
      value: roleStats?.totalSessions ?? dashboardStats?.totalSessions ?? 0,
      icon: <BarChart3 className="text-blue-600" size={24} />,
    },
    {
      title: 'Active Sessions',
      value: roleStats?.activeSessions ?? dashboardStats?.activeSessions ?? 0,
      icon: <Clock3 className="text-amber-600" size={24} />,
    },
    {
      title: 'Completed Sessions',
      value: roleStats?.completedSessions ?? dashboardStats?.completedSessions ?? 0,
      icon: <CheckCircle2 className="text-green-600" size={24} />,
    },
    {
      title: 'Completion Rate',
      value: `${roleStats?.completionRate ?? dashboardStats?.completionRate ?? 0}%`,
      icon: <Calendar className="text-purple-600" size={24} />,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/dashboard')}
              className="text-blue-600 hover:text-blue-700"
              aria-label="Back to dashboard"
            >
              <ArrowLeft size={22} />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
              <p className="text-gray-600 capitalize">Insights for {user?.role || 'user'}</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isLoading ? (
          <p className="text-gray-600">Loading analytics...</p>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
              {cards.map((card) => (
                <div key={card.title} className="bg-white rounded-lg shadow p-5 flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">{card.title}</p>
                    <p className="text-2xl font-bold text-gray-900">{card.value}</p>
                  </div>
                  {card.icon}
                </div>
              ))}
            </div>

            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-100">
                <h2 className="text-lg font-semibold text-gray-900">Monthly Session Trends</h2>
              </div>

              {trendRows.length === 0 ? (
                <p className="px-6 py-8 text-gray-600">No trend data available yet.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="text-left px-6 py-3 font-semibold text-gray-700">Month</th>
                        <th className="text-left px-6 py-3 font-semibold text-gray-700">Sessions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {trendRows.map(([month, count]) => (
                        <tr key={month} className="border-t border-gray-100">
                          <td className="px-6 py-3 text-gray-900">{month}</td>
                          <td className="px-6 py-3 text-gray-900">{count}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}
      </main>
    </div>
  );
};
