import React from 'react';
import { useNavigate } from 'react-router-dom';

function LogoutButton({ className = '' }) {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
    };

    return (
        <button className={`btn btn-danger ${className}`} onClick={handleLogout}>
            התנתק
        </button>
    );
}

export default LogoutButton;
