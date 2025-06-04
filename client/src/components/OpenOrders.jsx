import React, { useEffect, useState } from 'react';
import axios from 'axios';

function OpenOrders() {
    const [orders, setOrders] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Fetch open orders
        axios.get('/api/provider/orders/open', {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
        .then(response => setOrders(response.data.orders))
        .catch(err => setError('Failed to fetch open orders'));
    }, []);

    const approveOrder = (orderId) => {
        // Approve order
        axios.post('/api/provider/orders/approve', { orderId }, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
        .then(() => {
            setOrders(orders.filter(order => order._id !== orderId));
        })
        .catch(err => setError('Failed to approve order'));
    };

    return (
        <div>
            <h2>Open Orders</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <ul>
                {orders.map(order => (
                    <li key={order._id}>
                        <p>Order ID: {order._id}</p>
                        <p>Customer ID: {order.customerId}</p>
                        <button onClick={() => approveOrder(order._id)}>Approve</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default OpenOrders; 