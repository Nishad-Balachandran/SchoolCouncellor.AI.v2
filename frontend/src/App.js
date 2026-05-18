import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { ProtectedRoute } from './components/ProtectedRoute';
import { RoleProtectedRoute } from './components/RoleProtectedRoute';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { DashboardPage } from './pages/DashboardPage';
import { CounselingChatPage } from './pages/CounselingChatPage';
import { CounselingPage } from './pages/CounselingPage';
import { AppointmentsPage } from './pages/AppointmentsPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { AdminPage } from './pages/AdminPage';
import './styles/index.css';
function App() {
    return (_jsxs(_Fragment, { children: [_jsx(Toaster, { position: "top-right" }), _jsx(BrowserRouter, { children: _jsxs(Routes, { children: [_jsx(Route, { path: "/login", element: _jsx(LoginPage, {}) }), _jsx(Route, { path: "/register", element: _jsx(RegisterPage, {}) }), _jsx(Route, { path: "/dashboard", element: _jsx(ProtectedRoute, { children: _jsx(DashboardPage, {}) }) }), _jsx(Route, { path: "/counseling", element: _jsx(ProtectedRoute, { children: _jsx(CounselingPage, {}) }) }), _jsx(Route, { path: "/counseling/:sessionId", element: _jsx(ProtectedRoute, { children: _jsx(CounselingChatPage, {}) }) }), _jsx(Route, { path: "/appointments", element: _jsx(ProtectedRoute, { children: _jsx(AppointmentsPage, {}) }) }), _jsx(Route, { path: "/analytics", element: _jsx(ProtectedRoute, { children: _jsx(AnalyticsPage, {}) }) }), _jsx(Route, { path: "/admin", element: _jsx(RoleProtectedRoute, { allowedRoles: ['admin'], children: _jsx(AdminPage, {}) }) }), _jsx(Route, { path: "/", element: _jsx(Navigate, { to: "/dashboard", replace: true }) })] }) })] }));
}
export default App;
