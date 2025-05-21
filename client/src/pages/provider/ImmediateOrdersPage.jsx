import React, { useEffect, useState } from 'react';
import {
    getImmediateOrders,
    acceptImmediateOrder,
    rejectImmediateOrder
} from '../../services/api';
import GoogleMapEmbed from '../../components/GoogleMapEmbed'; // Component to show embedded map

function ImmediateOrdersPage() {
    // Component state
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isOnline, setIsOnline] = useState(() => {
        return localStorage.getItem('provider_online') === 'true';
    });

    // Fetch orders every 10 seconds when provider is online
    useEffect(() => {
        let interval;
        if (isOnline) {
            fetchOrders();
            interval = setInterval(fetchOrders, 10000);
        }
        return () => clearInterval(interval);
    }, [isOnline]);

    // Fetch immediate orders from the server
    const fetchOrders = async () => {
        try {
            setLoading(true);
            const data = await getImmediateOrders();
            setOrders(data || []);
            setError('');
        } catch (err) {
            setError('שגיאה בטעינת הקריאות');
        } finally {
            setLoading(false);
        }
    };

    // Toggle provider's availability status (locally stored)
    const toggleOnline = () => {
        const newStatus = !isOnline;
        setIsOnline(newStatus);
        localStorage.setItem('provider_online', newStatus);
        // Optional: send status to backend
    };

    // Accept an order and refresh list
    const handleAccept = async (orderId) => {
        try {
            await acceptImmediateOrder(orderId);
            await fetchOrders();
        } catch (err) {
            alert('שגיאה בקבלת הקריאה: ' + err.message);
        }
    };

    // Reject an order and refresh list
    const handleReject = async (orderId) => {
        try {
            await rejectImmediateOrder(orderId);
            await fetchOrders();
        } catch (err) {
            alert('שגיאה בדחיית הקריאה: ' + err.message);
        }
    };

    return (
        <div className="container">
            <h2>📞 קריאות מיידיות</h2>

            {/* Online/offline toggle */}
            <div className="mb-3">
                <button
                    className={`btn ${isOnline ? 'btn-success' : 'btn-outline-secondary'}`}
                    onClick={toggleOnline}
                >
                    {isOnline ? '✅ אני זמין לעבודה מיידית' : '🚫 אינני זמין כרגע'}
                </button>
            </div>

            {/* Feedback */}
            {loading && <p>⏳ טוען קריאות...</p>}
            {error && <div className="alert alert-danger">{error}</div>}
            {!loading && orders.length === 0 && <p>לא התקבלו קריאות כרגע.</p>}

            {/* Orders list */}
            <div className="admin-grid">
                {orders.map((order) => (
                    <div key={order._id} className="admin-card animate-glow">
                        <h5>🛠 {order.serviceType}</h5>
                        <p>📍 {order.location}</p>
                        <p>🕒 {new Date(order.datetime).toLocaleString('he-IL')}</p>
                        <p>📏 מרחק: {order.distance || 'לא זמין'} ק"מ</p>

                        {/* Embedded Google Map */}
                        <GoogleMapEmbed address={order.location} />

                        {/* Action buttons */}
                        <div className="d-flex justify-content-between mt-3">
                            <button
                                className="btn btn-sm btn-primary"
                                onClick={() => handleAccept(order._id)}
                            >
                                קבל
                            </button>
                            <button
                                className="btn btn-sm btn-danger"
                                onClick={() => handleReject(order._id)}
                            >
                                דחה
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default ImmediateOrdersPage;
