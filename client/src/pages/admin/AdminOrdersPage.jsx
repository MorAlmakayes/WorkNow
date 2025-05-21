import React, { useEffect, useState } from 'react';
import {
    getAllOrders,
    getAllRoles,
    getAllProviders,
    getUsers
} from '../../services/api';
import OrderDetailsModal from '../../components/modal/OrderDetailsModal';

function AdminOrdersPage() {
    const [orders, setOrders] = useState([]);
    const [filtered, setFiltered] = useState([]);
    const [roles, setRoles] = useState([]);
    const [providers, setProviders] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [showModal, setShowModal] = useState(false);

    const [filters, setFilters] = useState({
        role: '',
        status: '',
        provider: '',
        customer: '',
        date: ''
    });

    useEffect(() => {
        fetchData();
    }, []);

    // Load all necessary data
    const fetchData = async () => {
        const [o, r, p, c] = await Promise.all([
            getAllOrders(),
            getAllRoles(),
            getAllProviders(),
            getUsers()
        ]);
        setOrders(o);
        setFiltered(o);
        setRoles(r);
        setProviders(p);
        setCustomers(c);
    };

    // Apply all selected filters to orders
    const applyFilters = () => {
        const result = orders.filter(order => {
            const matchesRole = !filters.role || order.serviceType === filters.role;
            const matchesStatus = !filters.status || order.status === filters.status;
            const matchesProvider = !filters.provider || order.providerId === filters.provider;
            const matchesCustomer = !filters.customer || order.customerId === filters.customer;
            const matchesDate = !filters.date || order.datetime.startsWith(filters.date);
            return matchesRole && matchesStatus && matchesProvider && matchesCustomer && matchesDate;
        });
        setFiltered(result);
    };

    const handleChange = (e) => {
        setFilters({ ...filters, [e.target.name]: e.target.value });
    };

    const handleViewDetails = (order) => {
        setSelectedOrder(order);
        setShowModal(true);
    };

    return (
        <div className="container">
            <h2>ניהול הזמנות</h2>

            <div className="row g-2 mb-4">
                <div className="col">
                    <select className="form-select" name="role" onChange={handleChange}>
                        <option value="">-- תחום שירות --</option>
                        {roles.map((r, i) => <option key={i} value={r.name}>{r.name}</option>)}
                    </select>
                </div>
                <div className="col">
                    <select className="form-select" name="status" onChange={handleChange}>
                        <option value="">-- סטטוס --</option>
                        <option value="pending">ממתינה</option>
                        <option value="approved">מאושרת</option>
                        <option value="completed">הסתיימה</option>
                        <option value="cancelled">בוטלה</option>
                    </select>
                </div>
                <div className="col">
                    <select className="form-select" name="provider" onChange={handleChange}>
                        <option value="">-- ספק --</option>
                        {providers.map((p, i) => <option key={i} value={p._id}>{p.name}</option>)}
                    </select>
                </div>
                <div className="col">
                    <select className="form-select" name="customer" onChange={handleChange}>
                        <option value="">-- לקוח --</option>
                        {customers.map((c, i) => <option key={i} value={c._id}>{c.name}</option>)}
                    </select>
                </div>
                <div className="col">
                    <input type="date" className="form-control" name="date" onChange={handleChange} />
                </div>
                <div className="col">
                    <button className="btn btn-primary w-100" onClick={applyFilters}>סנן</button>
                </div>
            </div>

            <table className="table table-bordered">
                <thead>
                <tr>
                    <th>תאריך</th>
                    <th>תחום</th>
                    <th>סטטוס</th>
                    <th>ספק</th>
                    <th>לקוח</th>
                    <th>פעולות</th>
                </tr>
                </thead>
                <tbody>
                {filtered.map((o, i) => (
                    <tr key={i}>
                        <td>{new Date(o.datetime).toLocaleString('he-IL')}</td>
                        <td>{o.serviceType}</td>
                        <td>{o.status}</td>
                        <td>{providers.find(p => p._id === o.providerId)?.name || '—'}</td>
                        <td>{customers.find(c => c._id === o.customerId)?.name || '—'}</td>
                        <td>
                            <button className="btn btn-sm btn-outline-info" onClick={() => handleViewDetails(o)}>פרטים</button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>

            {/* Show order modal if selected */}
            <OrderDetailsModal show={showModal} onClose={() => setShowModal(false)} order={selectedOrder} />
        </div>
    );
}

export default AdminOrdersPage;