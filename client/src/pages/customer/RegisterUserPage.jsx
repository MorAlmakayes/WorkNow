import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../../services/api';

function isValidEmail(email) {
    const emailRegex = /^[\w\.-]+@[\w\.-]+\.\w+$/;
    return emailRegex.test(email);
}

function isValidIsraeliId(id) {
    return /^\d{9}$/.test(id);
}

function RegisterUserPage() {
    const [id, setId] = useState('');
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMessage('');

        // Validation
        if (!id || !isValidIsraeliId(id)) {
            setError('יש להזין תעודת זהות תקינה (9 ספרות)');
            return;
        }
        if (!name.trim()) {
            setError('יש להזין שם מלא');
            return;
        }
        if (!phone.trim()) {
            setError('יש להזין מספר טלפון');
            return;
        }
        if (!isValidEmail(email)) {
            setError('פורמט אימייל לא תקין');
            return;
        }
        if (password.length < 6) {
            setError('הסיסמה צריכה להכיל לפחות 6 תווים');
            return;
        }

        try {
            const res = await registerUser(name, email, password, phone, id);

            // ✅ Save details to localStorage
            localStorage.setItem('user_id', res.user_id);
            localStorage.setItem('prefill_identifier', res.username);

            setSuccessMessage(`נרשמת בהצלחה! שם המשתמש שלך הוא: ${res.username}`);

            setTimeout(() => {
                navigate('/login');
            }, 4000);
        } catch (err) {
            setError(err.response?.data?.error || 'שגיאה ביצירת משתמש');
        }
    };

    return (
        <div className="full-screen-center">
            <div className="container">
                <h2 className="text-center mb-4" style={{ color: 'var(--color-brand)' }}>הרשמה ללקוח</h2>

                {successMessage && (
                    <div className="alert alert-success text-center" role="alert">
                        {successMessage}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label">תעודת זהות</label>
                        <input type="text" className="form-control" value={id} onChange={(e) => setId(e.target.value)} required />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">שם מלא</label>
                        <input type="text" className="form-control" value={name} onChange={(e) => setName(e.target.value)} required />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">טלפון</label>
                        <input type="tel" className="form-control" value={phone} onChange={(e) => setPhone(e.target.value)} required />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">אימייל</label>
                        <input type="email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">סיסמה</label>
                        <input type="password" className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} required />
                    </div>

                    {error && <div className="text-danger text-center mb-3">{error}</div>}

                    <button type="submit" className="btn btn-primary w-100">הרשמה</button>
                </form>

                <div className="mt-3">
                    <button type="button" className="btn btn-secondary w-100" onClick={() => navigate('/register')}>
                        חזור
                    </button>
                </div>
            </div>
        </div>
    );
}

export default RegisterUserPage;
