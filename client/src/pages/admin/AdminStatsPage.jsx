import React, { useEffect, useState } from 'react';
import { getStats } from '../../services/api';
import { Bar, Pie } from 'react-chartjs-2';
import 'chart.js/auto'; // Auto-import chart types

function AdminStatsPage() {
    const [stats, setStats] = useState(null);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const data = await getStats();
            setStats(data);
        } catch (err) {
            console.error("שגיאה בטעינת סטטיסטיקות:", err.message);
        }
    };

    if (!stats) return <p>טוען נתונים...</p>;

    return (
        <div className="container">
            <h2>📊 סטטיסטיקות ודוחות</h2>

            {/* מספר הזמנות לפי תחום */}
            <h4 className="mt-4">מספר הזמנות לפי תחום</h4>
            <Bar
                data={{
                    labels: stats.orders_by_role.map(item => item.role),
                    datasets: [{
                        label: 'מספר הזמנות',
                        data: stats.orders_by_role.map(item => item.count)
                    }]
                }}
            />

            {/* כמות משתמשים לפי תפקיד */}
            <h4 className="mt-5">כמות משתמשים לפי סוג</h4>
            <Pie
                data={{
                    labels: Object.keys(stats.users_by_type),
                    datasets: [{
                        label: 'משתמשים',
                        data: Object.values(stats.users_by_type)
                    }]
                }}
            />

            {/* ממוצע זמינות לכל ספק */}
            <h4 className="mt-5">ממוצע זמינות (שעות/שבוע)</h4>
            <ul>
                {stats.avg_availability.map((prov, i) => (
                    <li key={i}>{prov.name} — {prov.hours_per_week} שעות</li>
                ))}
            </ul>

            {/* דירוגים ממוצעים */}
            <h4 className="mt-5">דירוגים ממוצעים לספקים</h4>
            <table className="table table-striped">
                <thead>
                <tr>
                    <th>ספק</th>
                    <th>ממוצע דירוג</th>
                    <th>מספר דירוגים</th>
                </tr>
                </thead>
                <tbody>
                {stats.avg_ratings.map((p, i) => (
                    <tr key={i}>
                        <td>{p.name}</td>
                        <td>{p.avg.toFixed(1)}</td>
                        <td>{p.count}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}

export default AdminStatsPage;
