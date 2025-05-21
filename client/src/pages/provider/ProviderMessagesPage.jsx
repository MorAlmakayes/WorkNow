import React, { useEffect, useState } from 'react';
import { getMessagesForProvider, markMessageAsHandled } from '../../services/api';

function ProviderMessagesPage() {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const providerId = localStorage.getItem('user_id');

    // Load messages when the page loads
    useEffect(() => {
        fetchMessages();
    }, []);

    // Fetch messages from backend
    const fetchMessages = async () => {
        try {
            setLoading(true);
            const data = await getMessagesForProvider(providerId);
            setMessages(data);
            setError('');
        } catch (err) {
            setError('שגיאה בטעינת הפניות');
        } finally {
            setLoading(false);
        }
    };

    // Mark message as handled
    const handleMarkAsRead = async (msgId) => {
        try {
            await markMessageAsHandled(msgId);
            fetchMessages();
        } catch (err) {
            alert('שגיאה בעדכון סטטוס הפנייה');
        }
    };

    return (
        <div className="container">
            <h2>📨 פניות מלקוחות</h2>
            {loading && <p>⏳ טוען פניות...</p>}
            {error && <div className="alert alert-danger">{error}</div>}
            {!loading && messages.length === 0 && <p>לא התקבלו פניות חדשות.</p>}

            <div className="admin-grid">
                {messages.map((msg) => (
                    <div key={msg._id} className={`admin-card ${msg.handled ? 'bg-light' : 'animate-glow'}`}>
                        <h5>👤 {msg.customerName}</h5>
                        <p>📧 {msg.email}</p>
                        <p>📅 {new Date(msg.date).toLocaleString('en-GB')}</p> {/* English date format */}
                        <p>📝 {msg.content}</p>

                        {!msg.handled && (
                            <button
                                className="btn btn-sm btn-success mt-2"
                                onClick={() => handleMarkAsRead(msg._id)}
                            >
                                סמן כטופל
                            </button>
                        )}
                        {msg.handled && <span className="text-muted">✅ טופל</span>}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default ProviderMessagesPage;