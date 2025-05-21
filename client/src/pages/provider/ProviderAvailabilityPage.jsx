import React, { useEffect, useState } from 'react';
import {
    getAvailabilitySettingsForProvider,
    updateAvailabilitySettingsForProvider
} from '../../services/api';

function ProviderAvailabilityPage() {
    const [availability, setAvailability] = useState({});
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [feedback, setFeedback] = useState('');

    const defaultAvailability = {
        'ראשון': { available: true, start: '09:00', end: '18:00' },
        'שני': { available: true, start: '09:00', end: '18:00' },
        'שלישי': { available: true, start: '09:00', end: '18:00' },
        'רביעי': { available: true, start: '09:00', end: '18:00' },
        'חמישי': { available: true, start: '09:00', end: '18:00' },
        'שישי': { available: true, start: '09:00', end: '14:00' },
    };

    const daysOfWeek = Object.keys(defaultAvailability);

    const hourOptions = Array.from({ length: 24 }, (_, hour) => {
        const h = hour.toString().padStart(2, '0');
        return [`${h}:00`, `${h}:30`];
    }).flat();

    const getUpcomingDateForDay = (hebrewDayName) => {
        const daysMap = {
            'ראשון': 0,
            'שני': 1,
            'שלישי': 2,
            'רביעי': 3,
            'חמישי': 4,
            'שישי': 5,
        };
        const today = new Date();
        const todayIndex = today.getDay();
        const targetIndex = daysMap[hebrewDayName];
        const diff = (targetIndex - todayIndex + 7) % 7;
        const nextDate = new Date();
        nextDate.setDate(today.getDate() + diff);

        return nextDate.toLocaleDateString('he-IL', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        });
    };

    useEffect(() => {
        fetchAvailability();
    }, []);

    const fetchAvailability = async () => {
        try {
            const data = await getAvailabilitySettingsForProvider();
            const merged = { ...defaultAvailability, ...(data || {}) };
            setAvailability(merged);
        } catch (err) {
            setFeedback('❌ שגיאה בטעינת זמינות');
        } finally {
            setLoading(false);
        }
    };

    const saveAvailability = async (updated) => {
        try {
            setSaving(true);
            setAvailability(updated);
            await updateAvailabilitySettingsForProvider(updated);
            setFeedback('✅ נשמר בהצלחה');
            setTimeout(() => setFeedback(''), 3000);
        } catch {
            setFeedback('❌ שגיאה בשמירה');
        } finally {
            setSaving(false);
        }
    };

    const handleChange = (day, field, value) => {
        const updated = {
            ...availability,
            [day]: {
                ...availability[day],
                [field]: value
            }
        };
        saveAvailability(updated);
    };

    const renderDropdown = (value, onChange) => (
        <select className="form-select" value={value || ''} onChange={onChange}>
            <option value="">בחר שעה</option>
            {hourOptions.map((time) => (
                <option key={time} value={time}>
                    {time}
                </option>
            ))}
        </select>
    );

    return (
        <div className="container">
            <h2>📅 ניהול יומן זמינות</h2>
            {loading && <p>⏳ טוען זמינות...</p>}
            {feedback && <div className="alert alert-info">{feedback}</div>}

            {!loading && (
                <div className="table-responsive">
                    <table className="table table-bordered table-striped">
                        <thead className="table-light">
                        <tr>
                            <th>יום</th>
                            <th>זמין</th>
                            <th>שעת התחלה</th>
                            <th>שעת סיום</th>
                        </tr>
                        </thead>
                        <tbody>
                        {daysOfWeek.map((day, idx) => {
                            const current = availability[day] || {};
                            const dateStr = getUpcomingDateForDay(day);
                            return (
                                <tr key={idx}>
                                    <td>{day} – {dateStr}</td>
                                    <td>
                                        <input
                                            type="checkbox"
                                            className="form-check-input"
                                            checked={current.available || false}
                                            onChange={(e) =>
                                                handleChange(day, 'available', e.target.checked)
                                            }
                                        />
                                    </td>
                                    <td>
                                        {renderDropdown(current.start, (e) =>
                                            handleChange(day, 'start', e.target.value)
                                        )}
                                    </td>
                                    <td>
                                        {renderDropdown(current.end, (e) =>
                                            handleChange(day, 'end', e.target.value)
                                        )}
                                    </td>
                                </tr>
                            );
                        })}
                        </tbody>
                    </table>
                </div>
            )}

            {saving && <p className="text-muted">שומר...</p>}
        </div>
    );
}

export default ProviderAvailabilityPage;
