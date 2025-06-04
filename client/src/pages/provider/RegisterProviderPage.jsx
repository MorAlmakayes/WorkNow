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
    const [fieldErrors, setFieldErrors] = useState({});
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
        setFieldErrors({});

        const { id, name, phone, email, password, selectedRole } = formData;
        const newFieldErrors = {};
        let hasError = false;

        // Validate ID (9 digits)
        if (!/^[0-9]{9}$/.test(id)) {
            newFieldErrors.id = 'יש להזין ת"ז תקינה (9 ספרות)';
            hasError = true;
        }

        // Validate name (at least 2 characters)
        if (!name.trim() || name.length < 2) {
            newFieldErrors.name = 'יש להזין שם מלא (לפחות 2 תווים)';
            hasError = true;
        }

        // Validate phone (Israeli format)
        if (!/^\d{10}$/.test(phone)) {
            newFieldErrors.phone = 'יש להזין מספר טלפון תקין (10 ספרות)';
            hasError = true;
        }

        // Validate email (standard format)
        if (!/^[\w.-]+@[\w.-]+\.\w+$/.test(email)) {
            newFieldErrors.email = 'אימייל לא תקין';
            hasError = true;
        }

        // Validate password (at least 8 characters, including a number and a special character)
        if (!/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/.test(password)) {
            newFieldErrors.password = 'סיסמה חייבת לכלול לפחות 8 תווים, מספר ותו מיוחד';
            hasError = true;
        }

        // Validate selected role
        if (!selectedRole) {
            newFieldErrors.selectedRole = 'יש לבחור תחום';
            hasError = true;
        }

        if (hasError) {
            setFieldErrors(newFieldErrors);
            setError('אנא תקן את השדות המסומנים');
            return;
        }
        try {
            const res = await registerProvider(name, email, password, phone, id, [selectedRole]);
            localStorage.setItem('user_id', res.user_id);
            localStorage.setItem('prefill_identifier', res.username);
            setSuccessMessage(`נרשמת בהצלחה! שם המשתמש שלך הוא: ${res.username}`);
            setTimeout(() => navigate('/login'), 4000);
        } catch (err) {
            console.error('❌ Registration error:', err);
            let msg = err?.response?.data?.error || 'שגיאה בהרשמה';
            setError(msg);
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
                                className={`form-control${fieldErrors[name] ? ' is-invalid' : ''}`}
                                type={type}
                                name={name}
                                value={formData[name]}
                                onChange={handleChange}
                                required
                            />
                            {fieldErrors[name] && (
                                <div className="invalid-feedback" style={{ display: 'block' }}>{fieldErrors[name]}</div>
                            )}
                        </div>
                    ))}

                    <div className="mb-3">
                        <label className="form-label">תחום עיסוק</label>
                        <select
                            name="selectedRole"
                            className={`form-select${fieldErrors.selectedRole ? ' is-invalid' : ''}`}
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
                        {fieldErrors.selectedRole && (
                            <div className="invalid-feedback" style={{ display: 'block' }}>{fieldErrors.selectedRole}</div>
                        )}
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
