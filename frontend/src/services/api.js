import axios from 'axios';
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
class ApiClient {
    constructor() {
        Object.defineProperty(this, "client", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
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
    async login(email, password) {
        return this.client.post('/auth/login', { email, password });
    }
    async register(data) {
        return this.client.post('/auth/register', data);
    }
    // Users endpoints
    async getProfile() {
        return this.client.get('/users/profile');
    }
    async updateProfile(data) {
        return this.client.put('/users/profile', data);
    }
    async getCounselors() {
        return this.client.get('/users/counselors');
    }
    async getUsers() {
        return this.client.get('/users');
    }
    async deleteUser(userId) {
        return this.client.delete(`/users/${userId}`);
    }
    // Counseling endpoints
    async createSession() {
        return this.client.post('/counseling/sessions');
    }
    async getSessions() {
        return this.client.get('/counseling/sessions');
    }
    async getCounselorQueueSessions() {
        return this.client.get('/counseling/sessions/queue');
    }
    async getSession(sessionId) {
        return this.client.get(`/counseling/sessions/${sessionId}`);
    }
    async addMessage(sessionId, content) {
        return this.client.post(`/counseling/sessions/${sessionId}/messages`, {
            content,
        });
    }
    async addCounselorMessage(sessionId, content) {
        return this.client.post(`/counseling/sessions/${sessionId}/counselor-message`, {
            content,
        });
    }
    async claimSession(sessionId) {
        return this.client.post(`/counseling/sessions/${sessionId}/claim`);
    }
    async getMessages(sessionId) {
        return this.client.get(`/counseling/sessions/${sessionId}/messages`);
    }
    async completeSession(sessionId, summary) {
        return this.client.post(`/counseling/sessions/${sessionId}/complete`, {
            summary,
        });
    }
    // Appointments endpoints
    async createAppointment(counselorId, scheduledTime) {
        return this.client.post('/appointments', {
            counselorId,
            scheduledTime,
        });
    }
    async getAppointments() {
        return this.client.get('/appointments');
    }
    async getAppointment(id) {
        return this.client.get(`/appointments/${id}`);
    }
    async cancelAppointment(id) {
        return this.client.put(`/appointments/${id}/cancel`);
    }
    async completeAppointment(id, counselorNotes) {
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
