import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import LogoutButton from './LogoutButton';

function Header() {
    const navigate = useNavigate();
    const role = localStorage.getItem('user_type');
    const username = localStorage.getItem('username') || 'משתמש';
    const [showMenu, setShowMenu] = useState(false);
    const menuRef = useRef();

    const navItems = {
        admin: [
            { label: 'ניהול משתמשים', path: '/admin/users' },
            { label: 'נותני שירות', path: '/admin/providers' },
            { label: 'תחומים', path: '/admin/roles' },
            { label: 'הזמנות', path: '/admin/orders' },
            { label: 'סטטיסטיקות', path: '/admin/stats' },
            { label: 'תמיכה', path: '/admin/support' }
        ],
        provider: [
            { label: 'הדשבורד שלי', path: '/dashboard/provider' },
            { label: 'לוח זמנים', path: '/provider/calendar' }
        ],
        customer: [
            { label: 'הדשבורד שלי', path: '/dashboard/customer' }
        ]
    };

    const currentNav = navItems[role] || [];

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setShowMenu(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <header className="admin-header">
            <h1 onClick={() => navigate(`/dashboard/${role || 'customer'}`)}>WorkNow</h1>

            <div className="nav-wrapper">
                {currentNav.map((item, i) => (
                    <Link key={i} to={item.path} className="btn btn-outline-secondary btn-sm">
                        {item.label}
                    </Link>
                ))}
            </div>

            <div className="user-menu" ref={menuRef}>
                <button
                    onClick={() => setShowMenu(!showMenu)}
                    className="btn btn-outline-primary btn-sm dropdown-toggle"
                >
                    {username}
                </button>

                {showMenu && (
                    <div className="custom-dropdown">
                        <Link className="dropdown-item" to="#">פרופיל</Link>
                        <Link className="dropdown-item" to="#">הגדרות</Link>
                        <hr className="dropdown-divider" />
                        <div className="dropdown-item">
                            <LogoutButton className="w-100 btn btn-danger" />
                        </div>
                    </div>
                )}
            </div>
        </header>
    );
}

export default Header;
