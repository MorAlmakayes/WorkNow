import React, { useEffect, useState } from 'react';
import { getOrdersByProvider } from '../../services/api';

function ProviderOrdersHistoryPage() {
    const [orders, setOrders] = useState([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const providerId = localStorage.getItem('user_id');
            const data = await getOrdersByProvider(providerId);
            setOrders(data);
            setError('');
        } catch (err) {
            setError('Failed to load order history');
        } finally {
            setLoading(false);
        }
    };

    const filteredOrders = orders.filter(order =>
        (order.customerName || '').toLowerCase().includes(search.toLowerCase()) ||
        (order.status || '').toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="container">
            <h2>📜 Order History</h2>
            <input
                type="text"
                className="form-control mb-3"
                placeholder="Search by customer name or status..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />

            {loading && <p>Loading...</p>}
            {error && <div className="alert alert-danger">{error}</div>}
            {!loading && filteredOrders.length === 0 && <p>No orders found.</p>}

            <div className="admin-grid">
                {filteredOrders.map((order) => (
                    <div key={order._id} className="admin-card">
                        <h5>{order.serviceType}</h5>
                        <p>📍 {order.location}</p>
                        <p>🕒 {new Date(order.datetime).toLocaleString('en-US')}</p>
                        <p>👤 Customer: {order.customerName || 'N/A'}</p>
                        <p>📌 Status: {order.status}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default ProviderOrdersHistoryPage;
