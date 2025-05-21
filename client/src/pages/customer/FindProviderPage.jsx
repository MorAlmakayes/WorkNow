import React, { useEffect, useState } from 'react';
import { getAllRoles, getAvailableProvidersByDate } from '../../services/api';

function FindProviderPage() {
    const [roles, setRoles] = useState([]);
    const [selectedRole, setSelectedRole] = useState('');
    const [location, setLocation] = useState('');
    const [address, setAddress] = useState('');
    const [providers, setProviders] = useState([]);
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        getAllRoles()
            .then(setRoles)
            .catch(() => setMessage("שגיאה בטעינת תחומי השירות"));

        navigator.geolocation.getCurrentPosition(
            async (pos) => {
                const coords = `${pos.coords.latitude},${pos.coords.longitude}`;
                setLocation(coords);
                await fetchAddress(pos.coords.latitude, pos.coords.longitude);
            },
            () => setAddress("מיקום לא זמין")
        );
    }, []);

    const fetchAddress = async (lat, lon) => {
        try {
            const response = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`);
            const data = await response.json();
            const { road, house_number, city, town, village, country } = data.address;
            const shortAddress = [road, house_number, city || town || village, country].filter(Boolean).join(', ');
            setAddress(shortAddress);
        } catch {
            setAddress("כתובת לא זמינה");
        }
    };

    const handleSearch = async () => {
        if (!selectedRole || !location) {
            setMessage("יש לבחור תחום שירות ולאפשר מיקום");
            return;
        }
        setLoading(true);
        try {
            const date = new Date().toISOString().split('T')[0];
            const results = await getAvailableProvidersByDate(selectedRole, date, location);
            setProviders(results);
            setMessage(results.length ? '' : 'לא נמצאו ספקים בתחום זה באזור שלך.');
        } catch {
            setMessage("שגיאה בטעינת הספקים");
        }
        setLoading(false);
    };

    return (
        <div className="container">
            <h2>חיפוש ספק</h2>
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

            <button className="btn btn-primary mt-3" onClick={handleSearch} disabled={loading}>
                {loading ? 'טוען...' : 'מצא ספקים באזור'}
            </button>

            {message && <div className="alert alert-info mt-3">{message}</div>}

            {providers.length > 0 && (
                <div className="mt-4">
                    <h4>ספקים זמינים:</h4>
                    <div className="admin-grid">
                        {providers.map((provider, index) => (
                            <div key={index} className="admin-card">
                                <h5>{provider.name}</h5>
                                <p>תחומים: {provider.servicesOffered?.join(', ')}</p>
                                <p>אזורי שירות: {provider.serviceAreas?.join(', ')}</p>
                                <button className="btn btn-sm btn-primary mt-2">צור קשר</button>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

export default FindProviderPage;
