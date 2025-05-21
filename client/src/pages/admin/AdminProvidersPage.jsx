import React, { useEffect, useState } from 'react';
import {
    getAllProviders,
    approveProvider,
    rejectProvider,
    updateProviderStatus,
    getOrdersByProvider
} from '../../services/api';
import { useNavigate } from 'react-router-dom';

function AdminProvidersPage() {
    const [providers, setProviders] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filtered, setFiltered] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        fetchProviders();
    }, []);

    const fetchProviders = async () => {
        setLoading(true);
        setError('');
        try {
            const data = await getAllProviders();
            setProviders(data);
            setFiltered(data);
        } catch (err) {
            setError('שגיאה בטעינת הספקים');
        }
        setLoading(false);
    };

    const handleSearch = () => {
        const term = searchTerm.trim();
        if (!term) return setFiltered(providers);
        const results = providers.filter(p =>
            p.name?.includes(term) ||
            p.email?.includes(term) ||
            p.id?.includes(term)
        );
        setFiltered(results);
    };

    const handleApprove = async (providerId) => {
        await approveProvider(providerId);
        fetchProviders();
    };

    const handleReject = async (providerId) => {
        await rejectProvider(providerId);
        fetchProviders();
    };

    const handleStatusChange = async (providerId, newStatus) => {
        await updateProviderStatus(providerId, newStatus);
        fetchProviders();
    };

    return (
        <div className="container">
            <h2>ניהול נותני שירות</h2>

            <div className="mb-3 d-flex gap-2">
                <input
                    type="text"
                    className="form-control"
                    placeholder="חיפוש לפי שם / אימייל / ת״ז"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button className="btn btn-primary" onClick={handleSearch}>חפש</button>
            </div>

            {loading ? (
                <p>טוען נתונים...</p>
            ) : error ? (
                <div className="alert alert-danger">{error}</div>
            ) : filtered.length === 0 ? (
                <div className="alert alert-info">לא נמצאו תוצאות</div>
            ) : (
                <table className="table table-bordered">
                    <thead>
                    <tr>
                        <th>שם</th>
                        <th>אימייל</th>
                        <th>סטטוס</th>
                        <th>תחומים</th>
                        <th>פעולות</th>
                    </tr>
                    </thead>
                    <tbody>
                    {filtered.map((p, i) => (
                        <tr key={i}>
                            <td>{p.name}</td>
                            <td>{p.email}</td>
                            <td>{p.status}</td>
                            <td>{p.roles?.join(', ')}</td>
                            <td>
                                {p.status === 'pending' ? (
                                    <>
                                        <button className="btn btn-success btn-sm me-1" onClick={() => handleApprove(p._id)}>אשר</button>
                                        <button className="btn btn-danger btn-sm" onClick={() => handleReject(p._id)}>דחה</button>
                                    </>
                                ) : (
                                    <select
                                        className="form-select form-select-sm mb-2"
                                        value={p.status}
                                        onChange={(e) => handleStatusChange(p._id, e.target.value)}
                                    >
                                        <option value="approved">מאושר</option>
                                        <option value="blocked">חסום</option>
                                        <option value="suspended">מושהה</option>
                                    </select>
                                )}
                                <button
                                    className="btn btn-outline-info btn-sm"
                                    onClick={() => navigate(`/admin/provider/${p._id}`)}
                                >
                                    צפייה בפרטים
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}

export default AdminProvidersPage;
