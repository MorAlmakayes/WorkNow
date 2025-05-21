import React from 'react';
import { Navigate } from 'react-router-dom';

function PrivateRoute({ children, requiredType }) {
    const token = localStorage.getItem('token');
    const userType = localStorage.getItem('user_type');

    // No token = redirect to login
    if (!token) {
        return <Navigate to="/login" />;
    }

    // Not authorized for this route = redirect to correct dashboard
    if (requiredType && userType !== requiredType) {
        return <Navigate to={`/dashboard/${userType}`} />;
    }

    return children;
}

export default PrivateRoute;
