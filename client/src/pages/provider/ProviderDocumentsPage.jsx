import React, { useState } from 'react';

function ProviderDocumentsPage() {
    const [documents, setDocuments] = useState([]);
    const [file, setFile] = useState(null);
    const [message, setMessage] = useState('');

    // Handle file upload
    const handleUpload = (e) => {
        e.preventDefault();
        if (!file) {
            setMessage('יש לבחור קובץ קודם.');
            return;
        }

        // Simulate file upload
        const newDoc = {
            id: Date.now(),
            name: file.name,
            uploadDate: new Date().toLocaleDateString('en-GB'),
            expires: '2025-12-31',
            status: 'בתוקף'
        };
        setDocuments([...documents, newDoc]);
        setFile(null);
        setMessage('המסמך הועלה בהצלחה');
    };

    return (
        <div className="container">
            <h2>📄 ניהול מסמכים</h2>

            <form onSubmit={handleUpload} className="mb-4">
                <input
                    type="file"
                    onChange={(e) => setFile(e.target.files[0])}
                    className="form-control mb-2"
                />
                <button type="submit" className="btn btn-primary">העלה מסמך</button>
                {message && <p className="mt-2 text-success">{message}</p>}
            </form>

            {documents.length === 0 ? (
                <p>לא קיימים מסמכים במערכת.</p>
            ) : (
                <table className="table">
                    <thead>
                    <tr>
                        <th>שם מסמך</th>
                        <th>תאריך העלאה</th>
                        <th>תוקף</th>
                        <th>סטטוס</th>
                    </tr>
                    </thead>
                    <tbody>
                    {documents.map((doc) => (
                        <tr key={doc.id}>
                            <td>{doc.name}</td>
                            <td>{doc.uploadDate}</td>
                            <td>{doc.expires}</td>
                            <td>{doc.status}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}

export default ProviderDocumentsPage;
