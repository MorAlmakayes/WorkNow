import React from 'react';
import { Link } from 'react-router-dom';

function ProviderDashboard() {
    const actions = [
        {
            title: 'הזמנות מיידיות',
            description: 'רשימת שירותים מיידיים שדורשים טיפול.',
            path: '/provider/immediate-orders'
        },
        {
            title: 'הזמנות עתידיות',
            description: 'שירותים עתידיים שנקבעו מראש.',
            path: '/provider/scheduled-orders'
        },
        {
            title: 'פניות מלקוחות',
            description: 'צפייה בפניות שהתקבלו ותגובה ישירה ללקוח.',
            path: '/provider/messages'
        },
        {
            title: 'סטטיסטיקות ביצועים',
            description: 'גרפים, דירוגים ורווחים יומיים / חודשיים.',
            path: '/provider/stats'
        },
        {
            title: 'ניהול שירותים',
            description: 'הוספה, עריכה ומחיקת שירותים ומחירים.',
            path: '/provider/services'
        },
        {
            title: 'היסטוריית הזמנות',
            description: 'חיפוש וסינון הזמנות, כולל הורדה ל־PDF.',
            path: '/provider/orders'
        },
        {
            title: 'ניהול מסמכים',
            description: 'העלאת רישיונות וקבלת התראות על פגי תוקף.',
            path: '/provider/documents'
        },
        {
            title: 'יומן וסנכרון חיצוני',
            description: 'סנכרון עם Google Calendar ותזכורות למייל.',
            path: '/provider/calendar'
        },
        {
            title: 'דוחות מותאמים',
            description: 'יצירת דוחות הכנסה, שעות עבודה ופעילות.',
            path: '/provider/reports'
        },
        {
            title: 'הגדרת זמינות',
            description: 'חסימת תאריכים, זמינות לפי תחום שירות.',
            path: '/provider/availability'
        },
        {
            title: 'מרכז עדכונים',
            description: 'הודעות מהמערכת ובלוג טיפים מקצועיים.',
            path: '/provider/announcements'
        },
        {
            title: 'ניהול תשלומים',
            description: 'צפייה בתשלומים, חיובים עתידיים וחשבוניות.',
            path: '/provider/payments'
        }
    ];

    return (
        <main className="admin-content full-dashboard">
            <h2 className="admin-welcome">👷‍♂️ ברוך הבא לדשבורד נותני השירות – WorkNow</h2>
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

export default ProviderDashboard;