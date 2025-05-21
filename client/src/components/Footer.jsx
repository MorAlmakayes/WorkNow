import React from 'react';

function Footer() {
    return (
        <footer className="text-center p-3 mt-5" style={{ backgroundColor: '#f1f1f1' }}>
            <small>© {new Date().getFullYear()} WorkNow. כל הזכויות שמורות.</small>
        </footer>
    );
}

export default Footer;
