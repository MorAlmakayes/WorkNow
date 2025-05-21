import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loginUser } from '../services/api';

function LoginPage() {
    const [identifier, setIdentifier] = useState(() => {
        const saved = localStorage.getItem('prefill_identifier');
        if (saved) localStorage.removeItem('prefill_identifier');
        return saved || '';
    });

    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!identifier || !password) {
            setError('נא להזין שם משתמש / אימייל וסיסמה');
            return;
        }

        try {
            const data = await loginUser(identifier, password);

            // ✅ שמירה מלאה ל־localStorage
            localStorage.setItem('token', data.access_token);
            localStorage.setItem('user_id', data.user.id);
            localStorage.setItem('user_type', data.user.user_type || 'customer');
            localStorage.setItem('username', data.user.username || 'משתמש');

            navigate(`/dashboard/${data.user.user_type || 'customer'}`);
        } catch (err) {
            setError(err.response?.data?.error || 'שגיאה בהתחברות');
        }
    };

    return (
        <div className="full-screen-center">
            <div className="container">
                <h2 className="text-center mb-4" style={{ color: 'var(--color-brand)' }}>התחברות</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label">שם משתמש / אימייל</label>
                        <input
                            type="text"
                            className="form-control"
                            value={identifier}
                            onChange={(e) => setIdentifier(e.target.value)}
                            required
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">סיסמה</label>
                        <input
                            type="password"
                            className="form-control"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    {error && <div className="text-danger text-center mb-3">{error}</div>}

                    <button type="submit" className="btn btn-primary w-100">התחבר</button>

                    <p className="mt-3 text-center">
                        אין לך חשבון? <Link to="/register" style={{ color: 'var(--color-brand)' }}>להרשמה</Link>
                    </p>
                </form>
            </div>
        </div>
    );
}

export default LoginPage;
