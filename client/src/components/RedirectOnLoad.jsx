import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function RedirectOnLoad() {
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        const userType = localStorage.getItem('user_type');

        if (!token || !userType) {
            navigate('/login');
        } else {
            navigate(`/dashboard/${userType}`);
        }
    }, [navigate]);

    return null;
}

export default RedirectOnLoad;