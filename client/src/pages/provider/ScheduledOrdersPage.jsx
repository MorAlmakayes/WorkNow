import React, { useEffect, useState } from 'react';
import { getScheduledOrders } from '../../services/api';

function ScheduledOrdersPage() {
    // Component state
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Get provider ID from local storage
    const providerId = localStorage.getItem('user_id');

    // On component mount, fetch scheduled orders
    useEffect(() => {
        if (!providerId) {
            setError('שגיאה בזיהוי המשתמש - אנא התחבר שוב');
            setLoading(false);
            return;
        }
        fetchOrders();
    }, []);

    // Fetch future scheduled orders
    const fetchOrders = async () => {
        try {
            setLoading(true);
            const data = await getScheduledOrders(providerId);
            const sorted = [...data].sort((a, b) => new Date(a.datetime) - new Date(b.datetime));
            setOrders(sorted);
            setError('');
        } catch (err) {
            setError('שגיאה בטעינת ההזמנות');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container">
            <h2>📅 הזמנות עתידיות</h2>

            {/* Manual refresh button */}
            <div className="mb-3">
                <button className="btn btn-outline-primary" onClick={fetchOrders}>
                    🔄 רענן
                </button>
            </div>

            {/* Loading, error or empty state */}
            {loading && (
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            )}
            {error && <div className="alert alert-danger mt-2">{error}</div>}
            {!loading && !error && orders.length === 0 && <p>אין הזמנות עתידיות כרגע.</p>}

            {/* Orders list */}
            <div className="admin-grid">
                {orders.map((order, index) => (
                    <div key={index} className="admin-card">
                        <h5>🛠 {order.serviceType}</h5>
                        <p>📍 {order.location}</p>
                        <p>🕒 {new Date(order.datetime).toLocaleString('he-IL')}</p>
                        <p>📌 סטטוס: {order.status}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default ScheduledOrdersPage;
