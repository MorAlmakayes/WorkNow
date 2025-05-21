import React from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

function RegisterPage() {
    const navigate = useNavigate();

    return (
        <div className="full-screen-center">
            <div className="container text-center">
                <h2 className="mb-4" style={{ color: 'var(--color-brand)' }}>בחר סוג הרשמה</h2>
                <div className="d-grid gap-3">
                    <button
                        className="btn btn-primary btn-lg"
                        onClick={() => navigate('/register/user')}
                    >
                        הרשמה ללקוח
                    </button>
                    <button
                        className="btn btn-primary btn-lg"
                        onClick={() => navigate('/register/provider')}
                    >
                        הרשמה לספק
                    </button>
                    <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={() => navigate('/login')}
                    >
                        חזור
                    </button>
                </div>
            </div>
        </div>
    );
}

export default RegisterPage;