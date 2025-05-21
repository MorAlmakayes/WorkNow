import React, { useEffect, useState } from 'react';
import { getAvailabilitySettings, updateAvailabilitySettings } from '../../services/api';

function AdminAvailabilityPage() {
    const [settings, setSettings] = useState({
        activeDays: [],
        startTime: '08:00',
        endTime: '17:00',
        maintenance: false,
        maintenanceMessage: '',
        holidays: []
    });

    const [message, setMessage] = useState('');

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const res = await getAvailabilitySettings();
            setSettings(res);
        } catch (err) {
            console.error('שגיאה בטעינת ההגדרות');
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setSettings(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const toggleDay = (day) => {
        setSettings(prev => ({
            ...prev,
            activeDays: prev.activeDays.includes(day)
                ? prev.activeDays.filter(d => d !== day)
                : [...prev.activeDays, day]
        }));
    };

    const handleSave = async () => {
        try {
            await updateAvailabilitySettings(settings);
            setMessage('ההגדרות נשמרו בהצלחה');
        } catch (err) {
            setMessage('שגיאה בשמירת ההגדרות');
        }
    };

    const daysOfWeek = ['א׳', 'ב׳', 'ג׳', 'ד׳', 'ה׳', 'ו׳'];

    return (
        <div className="container">
            <h2>תזמון פעילות המערכת</h2>

            <div className="mb-3">
                <label>ימים פעילים:</label>
                <div className="d-flex gap-2 flex-wrap">
                    {daysOfWeek.map((day, index) => (
                        <button
                            key={index}
                            className={`btn ${settings.activeDays.includes(index) ? 'btn-success' : 'btn-outline-secondary'}`}
                            onClick={() => toggleDay(index)}
                            type="button"
                        >
                            {day}
                        </button>
                    ))}
                </div>
            </div>

            <div className="mb-3">
                <label>שעות פעילות:</label>
                <div className="d-flex gap-2">
                    <input type="time" name="startTime" value={settings.startTime} onChange={handleChange} />
                    <input type="time" name="endTime" value={settings.endTime} onChange={handleChange} />
                </div>
            </div>

            <div className="mb-3">
                <label>
                    <input
                        type="checkbox"
                        name="maintenance"
                        checked={settings.maintenance}
                        onChange={handleChange}
                    /> מצב תחזוקה
                </label>
                {settings.maintenance && (
                    <input
                        type="text"
                        className="form-control mt-2"
                        placeholder="הודעת תחזוקה מותאמת"
                        name="maintenanceMessage"
                        value={settings.maintenanceMessage}
                        onChange={handleChange}
                    />
                )}
            </div>

            <div className="mb-3">
                <label>תאריכי חגים (YYYY-MM-DD):</label>
                <textarea
                    className="form-control"
                    rows={3}
                    name="holidays"
                    value={settings.holidays.join('\n')}
                    onChange={e => setSettings(prev => ({ ...prev, holidays: e.target.value.split('\n') }))}
                />
            </div>

            <button className="btn btn-primary" onClick={handleSave}>שמור הגדרות</button>
            {message && <div className="mt-3 alert alert-info">{message}</div>}
        </div>
    );
}

export default AdminAvailabilityPage;
