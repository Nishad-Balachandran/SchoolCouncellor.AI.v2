import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../contexts/authStore';
import api from '../services/api';
import { Plus, MessageCircle, Loader } from 'lucide-react';

export const CounselingPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [sessions, setSessions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadSessions();
  }, []);

  const loadSessions = async () => {
    try {
      const response = await api.getSessions();
      setSessions(response.data);
    } catch (error) {
      console.error('Failed to load sessions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateSession = async () => {
    try {
      const response = await api.createSession();
      navigate(`/counseling/${response.data.id}`);
    } catch (error) {
      console.error('Failed to create session:', error);
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
                Counseling Sessions
              </h1>
              <p className="text-gray-600">
                Talk to your AI counselor anytime
              </p>
            </div>
            <button
              onClick={handleCreateSession}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
            >
              <Plus size={20} />
              New Session
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isLoading ? (
          <div className="text-center py-12">
            <Loader className="animate-spin mx-auto mb-4" size={40} />
            <p className="text-gray-600">Loading sessions...</p>
          </div>
        ) : sessions.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <MessageCircle className="mx-auto mb-4 text-gray-400" size={48} />
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              No sessions yet
            </h2>
            <p className="text-gray-600 mb-6">
              Start your first counseling session with our AI counselor
            </p>
            <button
              onClick={handleCreateSession}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg inline-flex items-center gap-2"
            >
              <Plus size={20} />
              Start First Session
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sessions.map((session) => (
              <div
                key={session.id}
                className="bg-white rounded-lg shadow hover:shadow-lg transition cursor-pointer p-6"
                onClick={() => navigate(`/counseling/${session.id}`)}
              >
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-lg font-bold text-gray-900">
                    Session {session.id.slice(0, 8)}
                  </h3>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      session.status === 'active'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {session.status}
                  </span>
                </div>
                <p className="text-gray-600 text-sm mb-2">
                  Messages: {session.messages?.length || 0}
                </p>
                <p className="text-gray-500 text-xs">
                  Started {new Date(session.createdAt).toLocaleDateString()}
                </p>
                {session.summary && (
                  <p className="mt-3 text-sm text-gray-700 line-clamp-2">
                    {session.summary}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};
