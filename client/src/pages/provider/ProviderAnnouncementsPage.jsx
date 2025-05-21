import React, { useEffect, useState } from 'react';
import { getProviderAnnouncements } from '../../services/api';

function ProviderAnnouncementsPage() {
    const [announcements, setAnnouncements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Load announcements on page load
    useEffect(() => {
        fetchAnnouncements();
    }, []);

    // Fetch announcements from backend
    const fetchAnnouncements = async () => {
        try {
            const data = await getProviderAnnouncements();
            setAnnouncements(data || []);
            setError('');
        } catch (err) {
            setError('שגיאה בטעינת ההודעות');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container">
            <h2>📢 מרכז עדכונים</h2>

            {loading && <p>⏳ טוען הודעות...</p>}
            {error && <div className="alert alert-danger">{error}</div>}
            {!loading && announcements.length === 0 && <p>אין הודעות חדשות כרגע.</p>}

            <div className="admin-grid">
                {announcements.map((note) => (
                    <div key={note._id} className="admin-card">
                        <h4>📝 {note.title}</h4>
                        <p className="text-muted">
                            {new Date(note.date).toLocaleDateString('en-GB')} | 🗂 {note.category}
                        </p>
                        <p>{note.content}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default ProviderAnnouncementsPage;
