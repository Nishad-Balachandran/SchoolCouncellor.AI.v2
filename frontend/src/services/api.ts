import axios, { AxiosInstance } from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add token to requests
    this.client.interceptors.request.use((config) => {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });
  }

  // Auth endpoints
  async login(email: string, password: string) {
    return this.client.post('/auth/login', { email, password });
  }

  async register(data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    role?: string;
  }) {
    return this.client.post('/auth/register', data);
  }

  // Users endpoints
  async getProfile() {
    return this.client.get('/users/profile');
  }

  async updateProfile(data: any) {
    return this.client.put('/users/profile', data);
  }

  async getCounselors() {
    return this.client.get('/users/counselors');
  }

  // Counseling endpoints
  async createSession() {
    return this.client.post('/counseling/sessions');
  }

  async getSessions() {
    return this.client.get('/counseling/sessions');
  }

  async getSession(sessionId: string) {
    return this.client.get(`/counseling/sessions/${sessionId}`);
  }

  async addMessage(sessionId: string, content: string) {
    return this.client.post(`/counseling/sessions/${sessionId}/messages`, {
      content,
    });
  }

  async getMessages(sessionId: string) {
    return this.client.get(`/counseling/sessions/${sessionId}/messages`);
  }

  async completeSession(sessionId: string, summary?: string) {
    return this.client.post(`/counseling/sessions/${sessionId}/complete`, {
      summary,
    });
  }

  // Appointments endpoints
  async createAppointment(counselorId: string, scheduledTime: Date) {
    return this.client.post('/appointments', {
      counselorId,
      scheduledTime,
    });
  }

  async getAppointments() {
    return this.client.get('/appointments');
  }

  async getAppointment(id: string) {
    return this.client.get(`/appointments/${id}`);
  }

  async cancelAppointment(id: string) {
    return this.client.put(`/appointments/${id}/cancel`);
  }

  async completeAppointment(id: string, counselorNotes: string) {
    return this.client.put(`/appointments/${id}/complete`, { counselorNotes });
  }

  // Analytics endpoints
  async getDashboardStats() {
    return this.client.get('/analytics/dashboard');
  }

  async getStudentAnalytics() {
    return this.client.get('/analytics/student');
  }

  async getCounselorAnalytics() {
    return this.client.get('/analytics/counselor');
  }

  async getMonthlyTrends() {
    return this.client.get('/analytics/trends');
  }
}

export default new ApiClient();
