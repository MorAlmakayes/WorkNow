import React, { useEffect, useState } from 'react';
import { getAllRoles, addRole, deleteRole, toggleRoleActiveStatus } from '../../services/api';

function AdminRolesPage() {
    const [roles, setRoles] = useState([]);
    const [newRole, setNewRole] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        fetchRoles();
    }, []);

    const fetchRoles = async () => {
        try {
            const roleList = await getAllRoles();
            setRoles(roleList);
        } catch (err) {
            setError("שגיאה בטעינת התפקידים.");
        }
    };

    const handleAddRole = async () => {
        setError('');
        setSuccess('');
        if (!newRole.trim()) {
            setError('נא להזין שם תחום');
            return;
        }
        try {
            await addRole(newRole);
            setNewRole('');
            setSuccess('התחום נוסף בהצלחה');
            fetchRoles();
        } catch (err) {
            setError('שגיאה בהוספת תחום');
        }
    };

    const handleDeleteRole = async (roleName) => {
        if (!window.confirm(`האם למחוק את התחום "${roleName}"?`)) return;
        try {
            await deleteRole(roleName);
            fetchRoles();
        } catch {
            setError("שגיאה במחיקת תחום");
        }
    };

    const handleToggleActive = async (roleName) => {
        try {
            await toggleRoleActiveStatus(roleName);
            fetchRoles();
        } catch {
            setError("שגיאה בשינוי סטטוס תחום");
        }
    };

    return (
        <div className="container">
            <h2>ניהול קטגוריות תפקידים</h2>
            <div className="mb-3">
                <label className="form-label">הוסף תחום חדש:</label>
                <div className="d-flex gap-2">
                    <input
                        type="text"
                        className="form-control"
                        value={newRole}
                        onChange={(e) => setNewRole(e.target.value)}
                    />
                    <button className="btn btn-success" onClick={handleAddRole}>הוסף</button>
                </div>
            </div>

            {error && <div className="alert alert-danger">{error}</div>}
            {success && <div className="alert alert-success">{success}</div>}

            <table className="table mt-4">
                <thead>
                <tr>
                    <th>שם התחום</th>
                    <th>סטטוס</th>
                    <th>פעולות</th>
                </tr>
                </thead>
                <tbody>
                {roles.map((role, index) => (
                    <tr key={index}>
                        <td>{role.name}</td>
                        <td>{role.active ? 'פעיל' : 'מוסתר'}</td>
                        <td>
                            <button className="btn btn-sm btn-secondary me-2" onClick={() => handleToggleActive(role.name)}>
                                שנה סטטוס
                            </button>
                            <button className="btn btn-sm btn-danger" onClick={() => handleDeleteRole(role.name)}>
                                מחק
                            </button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}

export default AdminRolesPage;
