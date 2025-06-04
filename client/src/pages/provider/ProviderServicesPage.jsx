import React, { useEffect, useState } from 'react';
import { getMyServices, deleteServiceById, getAllServices, updateProviderServices } from '../../services/api';
import { Link } from 'react-router-dom';

function ProviderServicesPage() {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [allServices, setAllServices] = useState([]);
    const [selectedServices, setSelectedServices] = useState([]);

    useEffect(() => {
        fetchServices();
        fetchAllServices();
    }, []);

    const fetchServices = async () => {
        try {
            const data = await getMyServices();
            setServices(data || []);
            setError('');
        } catch (err) {
            setError('שגיאה בטעינת השירותים');
        } finally {
            setLoading(false);
        }
    };

    const fetchAllServices = async () => {
        try {
            const data = await getAllServices();
            setAllServices(data || []);
        } catch (err) {
            setError('שגיאה בטעינת כל השירותים');
        }
    };

    const handleDelete = async (serviceId) => {
        if (!window.confirm('האם אתה בטוח שברצונך למחוק את השירות?')) return;
        try {
            await deleteServiceById(serviceId);
            fetchServices();
        } catch (err) {
            alert('שגיאה במחיקת השירות');
        }
    };

    const handleServiceSelection = (serviceId) => {
        setSelectedServices((prevSelected) => {
            if (prevSelected.includes(serviceId)) {
                return prevSelected.filter(id => id !== serviceId);
            } else {
                return [...prevSelected, serviceId];
            }
        });
    };

    const handleUpdateServices = async () => {
        try {
            await updateProviderServices(selectedServices);
            alert('השירותים עודכנו בהצלחה');
        } catch (err) {
            alert('שגיאה בעדכון השירותים');
        }
    };

    return (
        <div className="container">
            <h2>🔧 ניהול שירותים</h2>
            <div className="mb-3">
                <Link to="/provider/services/add" className="btn btn-success">
                    ➕ הוסף שירות חדש
                </Link>
            </div>

            {loading && <p>⏳ טוען שירותים...</p>}
            {error && <div className="alert alert-danger">{error}</div>}
            {!loading && services.length === 0 && <p>לא קיימים שירותים עדיין.</p>}

            <div className="admin-grid">
                {allServices.map((srv) => (
                    <div key={srv._id} className="admin-card">
                        <h5>{srv.name}</h5>
                        <input
                            type="checkbox"
                            checked={selectedServices.includes(srv._id)}
                            onChange={() => handleServiceSelection(srv._id)}
                        />
                    </div>
                ))}
            </div>

            <button onClick={handleUpdateServices} className="btn btn-primary mt-3">
                עדכן שירותים
            </button>
        </div>
    );
}

export default ProviderServicesPage;