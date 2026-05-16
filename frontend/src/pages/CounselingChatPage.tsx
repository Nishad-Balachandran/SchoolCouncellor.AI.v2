import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';
import { Send, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../contexts/authStore';

export const CounselingChatPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { sessionId } = useParams<{ sessionId: string }>();
  const [messages, setMessages] = useState<any[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    if (sessionId) {
      loadSession();
      loadMessages();
    }
  }, [sessionId]);

  useEffect(() => {
    if (!sessionId) return;

    const interval = setInterval(() => {
      loadMessages();
    }, 3000);

    return () => clearInterval(interval);
  }, [sessionId]);

  const loadSession = async () => {
    try {
      const response = await api.getSession(sessionId!);
      setSession(response.data);
    } catch (error) {
      console.error('Failed to load session:', error);
    }
  };

  const loadMessages = async () => {
    try {
      const response = await api.getMessages(sessionId!);
      setMessages(response.data);
    } catch (error) {
      console.error('Failed to load messages:', error);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    setIsLoading(true);
    try {
      if (user?.role === 'counselor') {
        await api.addCounselorMessage(sessionId!, inputValue);
      } else {
        await api.addMessage(sessionId!, inputValue);
      }

      await loadMessages();
      setInputValue('');
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-4">
          <button
            onClick={() => navigate('/counseling')}
            className="text-blue-600 hover:text-blue-700"
          >
            <ArrowLeft size={24} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {user?.role === 'counselor' ? 'Counseling Session' : 'AI Counseling Session'}
            </h1>
            <p className="text-gray-600 text-sm">
              Started at {session?.createdAt
                ? new Date(session.createdAt).toLocaleString()
                : 'Just now'}
            </p>
            {session?.counselorId && (
              <p className="text-xs text-emerald-700 mt-1">
                Counselor assigned to this session
              </p>
            )}
          </div>
        </div>
      </header>

      {/* Chat Area */}
      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-8">
        <div className="bg-white rounded-lg shadow h-96 overflow-y-auto p-6 mb-4">
          <div className="space-y-4">
            {messages.length === 0 ? (
              <div className="text-center text-gray-500 py-12">
                <p>Start typing to begin your counseling session</p>
              </div>
            ) : (
              messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${
                    (msg.role === 'user' && user?.role === 'student') ||
                    (msg.role === 'counselor' && user?.role === 'counselor')
                      ? 'justify-end'
                      : 'justify-start'
                  }`}
                >
                  <div
                    className={`max-w-xs px-4 py-2 rounded-lg ${
                      msg.role === 'user'
                        ? 'bg-blue-600 text-white'
                        : msg.role === 'counselor'
                        ? 'bg-emerald-600 text-white'
                        : 'bg-gray-200 text-gray-900'
                    }`}
                  >
                    <p className="text-xs font-semibold opacity-80 mb-1">
                      {msg.role === 'user'
                        ? 'Student'
                        : msg.role === 'counselor'
                        ? 'Counselor'
                        : 'AI Counselor'}
                    </p>
                    <p>{msg.content}</p>
                    <p className="text-xs mt-1 opacity-70">
                      {new Date(msg.createdAt).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Input Area */}
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Type your message..."
            disabled={isLoading}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            disabled={isLoading || !inputValue.trim()}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-6 py-2 rounded-lg flex items-center gap-2 transition"
          >
            <Send size={20} />
            Send
          </button>
        </form>
      </main>
    </div>
  );
};
