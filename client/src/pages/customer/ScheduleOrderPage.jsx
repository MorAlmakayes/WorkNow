import React, { useEffect, useState } from 'react';
import { getAllRoles, getAvailableProvidersByDate, bookScheduledOrder } from '../../services/api';

function ScheduleOrderPage() {
    const [roles, setRoles] = useState([]);
    const [selectedRole, setSelectedRole] = useState('');
    const [selectedDate, setSelectedDate] = useState('');
    const [location, setLocation] = useState('');
    const [address, setAddress] = useState('');
    const [providers, setProviders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [pendingBookings, setPendingBookings] = useState(new Set());

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(
            async (pos) => {
                const coords = `${pos.coords.latitude},${pos.coords.longitude}`;
                setLocation(coords);
                await fetchAddress(pos.coords.latitude, pos.coords.longitude);
            },
            (err) => {
                console.error("Location error:", err);
                setLocation("מיקום לא זמין");
            }
        );

        const fetchRoles = async () => {
            try {
                const roleList = await getAllRoles();
                setRoles(roleList);
            } catch (err) {
                console.error("Error fetching roles", err);
            }
        };

        fetchRoles();
    }, []);

    const fetchAddress = async (lat, lon) => {
        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`
            );
            const data = await response.json();
            const { road, house_number, city, town, village, country } = data.address;

            const shortAddress = [
                road,
                house_number,
                city || town || village,
                country
            ].filter(Boolean).join(', ');

            setAddress(shortAddress);
        } catch (error) {
            console.error("Error fetching address:", error);
            setAddress("כתובת לא זמינה");
        }
    };

    const handleSearch = async () => {
        if (!selectedRole || !selectedDate) {
            setMessage("יש לבחור תחום שירות ותאריך");
            return;
        }

        setLoading(true);
        try {
            const results = await getAvailableProvidersByDate(selectedRole, selectedDate, location);
            setProviders(results);
            setMessage(results.length ? '' : 'לא נמצאו נותני שירות זמינים בתאריך זה.');
        } catch (err) {
            console.error(err);
            setMessage("שגיאה בטעינת נותני שירות.");
        }
        setLoading(false);
    };

    const handleBooking = async (providerId) => {
        if (!selectedDate) {
            setMessage("יש לבחור תאריך להזמנה.");
            return;
        }

        if (pendingBookings.has(providerId)) {
            setMessage("ההזמנה כבר נשלחת עבור ספק זה. אנא המתן.");
            return;
        }

        const confirm = window.confirm("האם אתה בטוח שברצונך להזמין את נותן השירות בתאריך זה?");
        if (!confirm) return;

        setPendingBookings(prev => new Set(prev.add(providerId)));

        try {
            await bookScheduledOrder(providerId, selectedRole, selectedDate, address);
            setMessage("ההזמנה נשלחה בהצלחה!");
        } catch (err) {
            console.error(err);
            setMessage("שגיאה בשליחת ההזמנה.");
        } finally {
            setPendingBookings(prev => {
                const updated = new Set(prev);
                updated.delete(providerId);
                return updated;
            });
        }
    };

    return (
        <div className="container">
            <h2>הזמנת שירות עתידי</h2>

            <p><strong>הכתובת שלך:</strong> {address || 'מאתר מיקום...'}</p>

            <label>בחר תחום שירות:</label>
            <select
                className="form-control"
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
            >
                <option value="">-- בחר תחום --</option>
                {roles.map((role, index) => (
                    <option key={index} value={role.name}>{role.name}</option>
                ))}
            </select>

            <label className="mt-3">בחר תאריך:</label>
            <input
                type="date"
                className="form-control"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
            />

            <button className="btn btn-primary mt-3" onClick={handleSearch} disabled={loading}>
                {loading ? 'מחפש...' : 'מצא נותני שירות זמינים'}
            </button>

            {message && <div className="alert alert-info mt-3">{message}</div>}

            {providers.length > 0 && (
                <div className="mt-4">
                    <h4>נותני שירות זמינים:</h4>
                    <div className="admin-grid">
                        {providers.map((provider, index) => (
                            <div key={index} className="admin-card">
                                <h5>{provider.name}</h5>
                                <p>תחומים: {provider.servicesOffered.join(', ')}</p>
                                <p>אזורי שירות: {provider.serviceAreas.join(', ')}</p>
                                <button
                                    className="btn btn-sm btn-primary mt-2"
                                    onClick={() => handleBooking(provider._id)}
                                >
                                    הזמן את הספק הזה
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

export default ScheduleOrderPage;
