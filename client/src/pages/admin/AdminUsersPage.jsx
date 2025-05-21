import React, { useState, useEffect } from 'react';
import { getUsers, updateUser, blockUser } from '../../services/api';

function AdminUsersPage() {
    const [users, setUsers] = useState([]);
    const [search, setSearch] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const data = await getUsers();
            setUsers(data);
        } catch (err) {
            setError("שגיאה בטעינת המשתמשים.");
        }
    };

    const handleSearch = () => {
        if (!search.trim()) {
            fetchUsers();
        } else {
            const filteredUsers = users.filter(user =>
                user.name.includes(search) ||
                user.email.includes(search) ||
                user.phone.includes(search)
            );
            setUsers(filteredUsers);
        }
    };

    const handleBlockUser = async (userId) => {
        try {
            await blockUser(userId);
            setSuccess('המשתמש נחסם בהצלחה');
            fetchUsers();
        } catch (err) {
            setError('שגיאה בחסימת המשתמש');
        }
    };

    const handleUpdateUser = async (userId, updatedData) => {
        try {
            await updateUser(userId, updatedData);
            setSuccess('המשתמש עודכן בהצלחה');
            fetchUsers();
        } catch (err) {
            setError('שגיאה בעדכון המשתמש');
        }
    };

    return (
        <div className="container">
            <h2>ניהול לקוחות</h2>
            {error && <div className="alert alert-danger">{error}</div>}
            {success && <div className="alert alert-success">{success}</div>}

            <div className="mb-3">
                <input
                    type="text"
                    className="form-control"
                    placeholder="חפש לפי שם, מייל, טלפון"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                <button className="btn btn-primary mt-2" onClick={handleSearch}>חפש</button>
            </div>

            <table className="table mt-4">
                <thead>
                <tr>
                    <th>שם</th>
                    <th>מייל</th>
                    <th>טלפון</th>
                    <th>סטטוס</th>
                    <th>פעולות</th>
                </tr>
                </thead>
                <tbody>
                {users.map((user, index) => (
                    <tr key={index}>
                        <td>{user.name}</td>
                        <td>{user.email}</td>
                        <td>{user.phone}</td>
                        <td>{user.blocked ? 'חסום' : 'פעיל'}</td>
                        <td>
                            <button className="btn btn-sm btn-warning" onClick={() => handleUpdateUser(user.id, { name: 'newName' })}>
                                עדכון
                            </button>
                            <button className="btn btn-sm btn-danger" onClick={() => handleBlockUser(user.id)}>
                                חסום
                            </button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}

export default AdminUsersPage;
