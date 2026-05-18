import { jsx as _jsx, Fragment as _Fragment } from "react/jsx-runtime";
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../contexts/authStore';
export const RoleProtectedRoute = ({ children, allowedRoles }) => {
    const { isAuthenticated, user } = useAuthStore();
    if (!isAuthenticated) {
        return _jsx(Navigate, { to: "/login", replace: true });
    }
    if (!user || !allowedRoles.includes(user.role)) {
        return _jsx(Navigate, { to: "/dashboard", replace: true });
    }
    return _jsx(_Fragment, { children: children });
};
