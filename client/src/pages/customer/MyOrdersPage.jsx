import React, { useEffect, useState } from 'react';
import { getMyOrders } from '../../services/api';

function MyOrdersPage() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');

    useEffect(() => {
        const fetchOrders = async () => {
            const customerId = localStorage.getItem('user_id');

            if (!customerId) {
                setMessage("שגיאה: לא נמצא מזהה משתמש");
                setLoading(false);
                return;
            }

            try {
                const data = await getMyOrders(customerId);
                setOrders(data);
                setMessage(data.length ? '' : 'לא נמצאו הזמנות.');
            } catch (err) {
                console.error(err);
                setMessage('שגיאה בטעינת ההזמנות.');
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    return (
        <div className="container">
            <h2>ההזמנות שלי</h2>

            {loading ? (
                <p>טוען...</p>
            ) : message ? (
                <div className="alert alert-info">{message}</div>
            ) : (
                <div className="admin-grid">
                    {orders.map((order, index) => (
                        <div key={index} className="admin-card">
                            <h5>🛠 {order.serviceType}</h5>
                            <p>📅 {new Date(order.datetime).toLocaleString('he-IL')}</p>
                            <p>🧑‍🔧 ספק: {order.providerName || 'טרם שויך'}</p>
                            <p>📍 {order.location}</p>
                            <p>סטטוס: <strong>{order.status}</strong></p>
                            {order.rating && (
                                <p>⭐ דירוג: {order.rating}/5</p>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default MyOrdersPage;
