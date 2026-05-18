import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Trash2, Users, UserCheck, GraduationCap, Shield } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../services/api';
import { useAuthStore } from '../contexts/authStore';

export const AdminPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadUsers = async () => {
    try {
      const response = await api.getUsers();
      setUsers(response.data);
    } catch (error) {
      toast.error('Failed to load users');
    } finally {
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

  const handleDeleteUser = async (id: string, name: string) => {
    if (!window.confirm(`Delete ${name}? This action cannot be undone.`)) {
      return;
    }

    try {
      await api.deleteUser(id);
      toast.success('User deleted');
      setUsers((prev) => prev.filter((item) => item.id !== id));
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Failed to delete user');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-start gap-3">
              <button
                onClick={() => navigate('/dashboard')}
                className="mt-1 text-blue-600 hover:text-blue-700"
                aria-label="Back to dashboard"
              >
                <ArrowLeft size={22} />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Admin Console</h1>
                <p className="text-gray-600">Manage users and platform access</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow p-5 flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Users</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <Users className="text-blue-600" />
          </div>
          <div className="bg-white rounded-lg shadow p-5 flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Students</p>
              <p className="text-2xl font-bold text-gray-900">{stats.students}</p>
            </div>
            <GraduationCap className="text-green-600" />
          </div>
          <div className="bg-white rounded-lg shadow p-5 flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Counselors</p>
              <p className="text-2xl font-bold text-gray-900">{stats.counselors}</p>
            </div>
            <UserCheck className="text-amber-600" />
          </div>
          <div className="bg-white rounded-lg shadow p-5 flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Admins</p>
              <p className="text-2xl font-bold text-gray-900">{stats.admins}</p>
            </div>
            <Shield className="text-purple-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="border-b border-gray-100 px-6 py-4">
            <h2 className="text-lg font-semibold text-gray-900">User Directory</h2>
          </div>

          {isLoading ? (
            <p className="px-6 py-8 text-gray-600">Loading users...</p>
          ) : users.length === 0 ? (
            <p className="px-6 py-8 text-gray-600">No users found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left px-6 py-3 font-semibold text-gray-700">Name</th>
                    <th className="text-left px-6 py-3 font-semibold text-gray-700">Email</th>
                    <th className="text-left px-6 py-3 font-semibold text-gray-700">Role</th>
                    <th className="text-right px-6 py-3 font-semibold text-gray-700">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((item) => {
                    const isCurrentUser = item.id === user?.id;
                    return (
                      <tr key={item.id} className="border-t border-gray-100">
                        <td className="px-6 py-3 text-gray-900">{item.firstName} {item.lastName}</td>
                        <td className="px-6 py-3 text-gray-700">{item.email}</td>
                        <td className="px-6 py-3">
                          <span className="capitalize px-3 py-1 rounded-full bg-gray-100 text-gray-700">
                            {item.role}
                          </span>
                        </td>
                        <td className="px-6 py-3 text-right">
                          <button
                            onClick={() => handleDeleteUser(item.id, `${item.firstName} ${item.lastName}`)}
                            disabled={isCurrentUser}
                            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-red-600 hover:bg-red-700 text-white disabled:bg-gray-300"
                          >
                            <Trash2 size={15} />
                            Delete
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};
