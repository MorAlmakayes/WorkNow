import React, { useEffect, useState } from 'react';
import { getProviderStats } from '../../services/api';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

function ProviderStatsPage() {
    const [stats, setStats] = useState(null);
    const [error, setError] = useState('');
    const providerId = localStorage.getItem('user_id');

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const data = await getProviderStats(providerId);
            setStats(data);
            setError('');
        } catch (err) {
            setError('שגיאה בטעינת סטטיסטיקות הספק');
        }
    };

    return (
        <div className="container">
            <h2>📊 סטטיסטיקות ביצועים</h2>
            {error && <div className="alert alert-danger">{error}</div>}

            {!stats && !error && <p>⏳ טוען נתונים...</p>}

            {stats && (
                <>
                    <div className="stats-summary">
                        <p>💰 סך הכנסות: ₪{stats.totalEarnings}</p>
                        <p>📦 סך הזמנות: {stats.totalOrders}</p>
                        <p>⭐ דירוג ממוצע: {stats.averageRating}</p>
                    </div>

                    <h4>📈 גרף הכנסות לפי תאריך</h4>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={stats.earningsByDate} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey="earnings" stroke="#8884d8" name="הכנסות" />
                        </LineChart>
                    </ResponsiveContainer>
                </>
            )}
        </div>
    );
}

export default ProviderStatsPage;