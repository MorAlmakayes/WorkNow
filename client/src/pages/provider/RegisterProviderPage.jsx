import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerProvider, getAllRoles } from '../../services/api';

function RegisterProviderPage() {
    const [formData, setFormData] = useState({
        id: '',
        name: '',
        phone: '',
        email: '',
        password: '',
        selectedRole: ''
    });

    const [roles, setRoles] = useState([]);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchRoles = async () => {
            try {
                const rolesArray = await getAllRoles(); // Already an array!
                console.log("📥 API response raw:", rolesArray);
                setRoles(rolesArray); // Directly use the array, not .roles
            } catch (err) {
                console.error('❌ Failed to load roles:', err);
                setError('שגיאה בטעינת תחומים');
            }
        };
        fetchRoles();
    }, []);




    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMessage('');

        const { id, name, phone, email, password, selectedRole } = formData;

        if (!/^\d{9}$/.test(id)) return setError('יש להזין ת"ז תקינה');
        if (!name.trim()) return setError('יש להזין שם מלא');
        if (!phone.trim()) return setError('יש להזין טלפון');
        if (!/^[\w\.-]+@[\w\.-]+\.\w+$/.test(email)) return setError('אימייל לא תקין');
        if (password.length < 6) return setError('סיסמה קצרה מדי');
        if (!selectedRole) return setError('יש לבחור תחום');

        try {
            const res = await registerProvider(name, email, password, phone, id, [selectedRole]);
            localStorage.setItem('user_id', res.user_id);
            localStorage.setItem('prefill_identifier', res.username);
            setSuccessMessage(`נרשמת בהצלחה! שם המשתמש שלך הוא: ${res.username}`);
            setTimeout(() => navigate('/login'), 4000);
        } catch (err) {
            console.error('❌ Registration error:', err);
            setError(err?.response?.data?.error || 'שגיאה בהרשמה');
        }
    };

    return (
        <div className="full-screen-center">
            <div className="container">
                <h2 className="text-center mb-4" style={{ color: 'var(--color-brand)' }}>הרשמת ספק</h2>

                {successMessage && (
                    <div className="alert alert-success text-center">{successMessage}</div>
                )}

                <form onSubmit={handleSubmit}>
                    {[
                        { name: 'id', label: 'תעודת זהות', type: 'text' },
                        { name: 'name', label: 'שם מלא', type: 'text' },
                        { name: 'phone', label: 'טלפון', type: 'tel' },
                        { name: 'email', label: 'אימייל', type: 'email' },
                        { name: 'password', label: 'סיסמה', type: 'password' }
                    ].map(({ name, label, type }) => (
                        <div className="mb-3" key={name}>
                            <label className="form-label">{label}</label>
                            <input
                                className="form-control"
                                type={type}
                                name={name}
                                value={formData[name]}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    ))}

                    <div className="mb-3">
                        <label className="form-label">תחום עיסוק</label>
                        <select
                            name="selectedRole"
                            className="form-select"
                            value={formData.selectedRole}
                            onChange={handleChange}
                            required
                        >
                            <option value="">בחר תחום</option>
                            {roles.map((role) => (
                                <option key={role._id} value={role.name}>
                                    {role.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {error && <div className="text-danger text-center mb-3">{error}</div>}

                    <button type="submit" className="btn btn-primary w-100">הרשמה</button>

                    <div className="mt-3">
                        <button
                            type="button"
                            className="btn btn-secondary w-100"
                            onClick={() => navigate('/register')}
                        >
                            חזור
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default RegisterProviderPage;
