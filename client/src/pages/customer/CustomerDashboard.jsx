import React from 'react';
import { Link } from 'react-router-dom';

function CustomerDashboard() {
    const actions = [
        {
            title: 'הזמנת שירות מיידי',
            description: 'קבל שירות מיידי מספק זמין באזור שלך.',
            path: '/customer/order-now'
        },
        {
            title: 'הזמנת שירות עתידי',
            description: 'קבע מועד עתידי לקבלת שירות.',
            path: '/customer/schedule-order'
        },
        {
            title: 'ההזמנות האחרונות שלי',
            description: 'צפייה בפרטים של ההזמנות האחרונות שביצעת.',
            path: '/customer/my-orders'
        },
        {
            title: 'חיפוש ספק',
            description: 'מצא ספק לפי תחום, דירוג, מיקום או זמינות.',
            path: '/customer/find-provider'
        }
    ];

    return (
        <main className="admin-content full-dashboard">
            <h2 className="admin-welcome">🎯 ברוך הבא לדשבורד לקוחות</h2>
            <div className="admin-grid">
                {actions.map((action, index) => (
                    <div key={index} className="admin-card animate-glow">
                        <h3>{action.title}</h3>
                        <p>{action.description}</p>
                        <Link to={action.path} className="btn-enter">כניסה</Link>
                    </div>
                ))}
            </div>
        </main>
    );
}

export default CustomerDashboard;
