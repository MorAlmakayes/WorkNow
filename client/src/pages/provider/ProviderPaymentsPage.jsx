import React, { useEffect, useState } from 'react';

function ProviderPaymentsPage() {
    const [payments, setPayments] = useState([]);
    const [isAvailableNow, setIsAvailableNow] = useState(() => {
        return localStorage.getItem('provider_online') === 'true';
    });

    useEffect(() => {
        fetchPayments();
    }, []);

    const fetchPayments = async () => {
        // 🔧 Replace this with actual API call when ready
        const mockData = [
            {
                date: '2025-05-10T14:30:00Z',
                amount: 350,
                description: 'Immediate job - Plumbing',
                status: 'Paid'
            },
            {
                date: '2025-05-08T10:00:00Z',
                amount: 200,
                description: 'Scheduled job - Electrician',
                status: 'Pending'
            }
        ];
        setPayments(mockData);
    };

    const toggleAvailability = () => {
        const newStatus = !isAvailableNow;
        setIsAvailableNow(newStatus);
        localStorage.setItem('provider_online', newStatus);
        // Optional: update DB
    };

    return (
        <div className="container">
            <h2>💳 ניהול תשלומים</h2>

            <div className="mb-3">
                <button
                    className={`btn ${isAvailableNow ? 'btn-success' : 'btn-outline-secondary'}`}
                    onClick={toggleAvailability}
                >
                    {isAvailableNow ? '✅ זמין לקריאות מיידיות' : '🚫 לא זמין כרגע'}
                </button>
            </div>

            {payments.length === 0 ? (
                <p>אין תשלומים זמינים להצגה.</p>
            ) : (
                <div className="admin-grid">
                    {payments.map((pay, index) => (
                        <div key={index} className="admin-card">
                            <h5>💰 ₪{pay.amount}</h5>
                            <p>{pay.description}</p>
                            <p>🕒 {new Date(pay.date).toLocaleString('en-US')}</p>
                            <p>📌 סטטוס: {pay.status}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default ProviderPaymentsPage;