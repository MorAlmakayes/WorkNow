import React from 'react';
import { Link } from 'react-router-dom';

// Admin dashboard home view with links to all management features
function AdminDashboard() {
    const sections = [
        {
            title: 'ניהול משתמשים',
            description: 'רשימת משתמשים, חיפוש לפי שם או מייל, חסימה, שינוי תפקיד.',
            action: 'לניהול משתמשים',
            path: '/admin/users'
        },
        {
            title: 'ניהול נותני שירות',
            description: 'אישור ספקים חדשים, שינוי סטטוס, חיפוש לפי ת"ז או שם.',
            action: 'לניהול נותני שירות',
            path: '/admin/providers'
        },
        {
            title: 'ניהול תחומי עיסוק (Roles)',
            description: 'הוספה, עריכה, הסתרה של תחומי שירות לצורך שליטה ברישום.',
            action: 'לניהול תחומים',
            path: '/admin/roles'
        },
        {
            title: 'ניהול הזמנות',
            description: 'רשימת כל ההזמנות עם פילטרים לפי תחום, סטטוס, ספק או לקוח.',
            action: 'לניהול הזמנות',
            path: '/admin/orders'
        },
        {
            title: 'סטטיסטיקות ודוחות',
            description: 'גרפים, כמות משתמשים חדשים, דירוגים ותובנות עומס.',
            action: 'לסטטיסטיקות',
            path: '/admin/stats'
        },
        {
            title: 'תזמון פעילות האתר',
            description: 'הגדרת שעות פעילות, סגירה אוטומטית בחגים, מצב תחזוקה.',
            action: 'לניהול פעילות האתר',
            path: '/admin/schedule'
        },
        {
            title: 'תמיכה ושליחת הודעות',
            description: 'שליחת הודעות גורפות, ניהול פניות תמיכה ומעקב אחריהן.',
            action: 'לניהול תמיכה',
            path: '/admin/support'
        },
        {
            title: 'ניהול תוכן וכותרות',
            description: 'עריכת טקסטים סטטיים והודעות זמניות לעמודי האתר.',
            action: 'לניהול תוכן',
            path: '/admin/content'
        }
    ];

    return (
        <main className="admin-content full-dashboard">
            <h2 className="admin-welcome">ברוך הבא למערכת הניהול 👨‍💻</h2>
            <div className="admin-grid">
                {sections.map((section, index) => (
                    <div key={index} className="admin-card">
                        <h3>{section.title}</h3>
                        <p>{section.description}</p>
                        <Link to={section.path} className="btn btn-primary w-100 mt-2">
                            {section.action}
                        </Link>
                    </div>
                ))}
            </div>
        </main>
    );
}

export default AdminDashboard;
