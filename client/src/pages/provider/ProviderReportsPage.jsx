import React, { useEffect, useState } from 'react';
import { getProviderReports } from '../../services/api';

function ProviderReportsPage() {
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const providerId = localStorage.getItem('user_id');

    // Handle fetching reports based on selected dates
    const fetchReports = async () => {
        if (!startDate || !endDate) {
            setError('יש לבחור טווח תאריכים');
            return;
        }

        try {
            setLoading(true);
            const data = await getProviderReports(providerId, startDate, endDate);
            setReports(data);
            setError('');
        } catch (err) {
            setError('שגיאה בטעינת הדוחות');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container">
            <h2>📊 דוחות מותאמים</h2>
            <div className="row mb-3">
                <div className="col-md-4">
                    <label>מתאריך:</label>
                    <input type="date" className="form-control" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                </div>
                <div className="col-md-4">
                    <label>עד תאריך:</label>
                    <input type="date" className="form-control" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                </div>
                <div className="col-md-4 d-flex align-items-end">
                    <button className="btn btn-primary w-100" onClick={fetchReports}>הצג דוחות</button>
                </div>
            </div>

            {error && <div className="alert alert-danger">{error}</div>}
            {loading && <p>⏳ טוען דוחות...</p>}

            {reports.length > 0 && (
                <table className="table table-bordered table-striped">
                    <thead>
                    <tr>
                        <th>📅 תאריך</th>
                        <th>🛠 מספר הזמנות</th>
                        <th>⏱ שעות עבודה</th>
                        <th>💰 סך הכנסה</th>
                    </tr>
                    </thead>
                    <tbody>
                    {reports.map((report, i) => (
                        <tr key={i}>
                            <td>{new Date(report.date).toLocaleDateString('en-GB')}</td>
                            <td>{report.totalOrders}</td>
                            <td>{report.totalHours}</td>
                            <td>{report.totalEarnings.toLocaleString()} ₪</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            )}

            {!loading && reports.length === 0 && !error && <p>לא נמצאו דוחות לתקופה שנבחרה.</p>}
        </div>
    );
}

export default ProviderReportsPage;