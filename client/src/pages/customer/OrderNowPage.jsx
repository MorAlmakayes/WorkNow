import React, { useEffect, useState } from 'react';
import { createInstantOrder, getAllRoles } from '../../services/api';

function OrderNowPage() {
    const [roles, setRoles] = useState([]);
    const [serviceType, setServiceType] = useState('');
    const [location, setLocation] = useState('');
    const [address, setAddress] = useState('');
    const [customAddress, setCustomAddress] = useState('');
    const [useCustomAddress, setUseCustomAddress] = useState(false);
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

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

    const handleOrderNow = async () => {
        if (!serviceType || !location) {
            setMessage("יש לבחור תחום שירות ולאפשר מיקום");
            return;
        }

        const finalAddress = useCustomAddress ? customAddress : address;

        setLoading(true);
        try {
            await createInstantOrder(serviceType, finalAddress);
            setMessage("ההזמנה נשלחה לספקים באזור שלך!");
        } catch (err) {
            console.error(err);
            setMessage("שגיאה בשליחת הזמנה");
        }
        setLoading(false);
    };

    return (
        <div className="container">
            <h2>הזמנת שירות מיידי</h2>

            <div className="mb-3">
                <label>הכתובת הנוכחית שלך:</label>
                {!useCustomAddress ? (
                    <>
                        <p><strong>{address || "מאתר מיקום..."}</strong></p>
                        <button className="btn btn-sm btn-outline-secondary" onClick={() => setUseCustomAddress(true)}>
                            ערוך כתובת ידנית
                        </button>
                    </>
                ) : (
                    <>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="הכנס כתובת מדויקת"
                            value={customAddress}
                            onChange={(e) => setCustomAddress(e.target.value)}
                        />
                        <button className="btn btn-sm btn-outline-secondary mt-1" onClick={() => setUseCustomAddress(false)}>
                            חזרה לכתובת אוטומטית
                        </button>
                    </>
                )}
            </div>

            <label>בחר תחום שירות:</label>
            <select
                className="form-control"
                value={serviceType}
                onChange={(e) => setServiceType(e.target.value)}
            >
                <option value="">-- בחר תחום --</option>
                {roles.map((role, index) => (
                    <option key={index} value={role.name}>{role.name}</option>
                ))}
            </select>

            <button className="btn btn-primary mt-3" onClick={handleOrderNow} disabled={loading}>
                {loading ? 'שולח...' : 'הזמן עכשיו'}
            </button>

            {message && <div className="alert alert-info mt-3">{message}</div>}
        </div>
    );
}

export default OrderNowPage;
