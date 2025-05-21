import React, { useEffect, useState } from 'react';
import { getMyServices, deleteServiceById } from '../../services/api';
import { Link } from 'react-router-dom';

function ProviderServicesPage() {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchServices();
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

    const handleDelete = async (serviceId) => {
        if (!window.confirm('האם אתה בטוח שברצונך למחוק את השירות?')) return;
        try {
            await deleteServiceById(serviceId);
            fetchServices();
        } catch (err) {
            alert('שגיאה במחיקת השירות');
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
                {services.map((srv) => (
                    <div key={srv._id} className="admin-card">
                        <h5>{srv.name}</h5>
                        <p>💰 מחיר: {srv.price} ₪</p>
                        <p>📍 אזורי שירות: {srv.areas?.join(', ')}</p>
                        <div className="d-flex justify-content-between mt-3">
                            <Link to={`/provider/services/edit/${srv._id}`} className="btn btn-sm btn-primary">
                                ערוך
                            </Link>
                            <button onClick={() => handleDelete(srv._id)} className="btn btn-sm btn-danger">
                                מחק
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default ProviderServicesPage;