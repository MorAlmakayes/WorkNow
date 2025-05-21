import React from 'react';

// Modal component to display full order details
function OrderDetailsModal({ order, onClose }) {
    if (!order) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-box">
                {/* Close button */}
                <button className="close-button" onClick={onClose}>✖</button>

                <h4 className="mb-3">פרטי ההזמנה</h4>

                {/* Order fields */}
                <p><strong>לקוח:</strong> {order.customerName || '---'}</p>
                <p><strong>ספק:</strong> {order.providerName || 'טרם שויך'}</p>
                <p><strong>תחום שירות:</strong> {order.serviceType || '---'}</p>
                <p><strong>מיקום:</strong> {order.location || '---'}</p>
                <p><strong>תאריך:</strong> {new Date(order.datetime).toLocaleString('he-IL')}</p>
                <p><strong>סטטוס:</strong> {order.status}</p>

                {/* Optional fields */}
                {order.rating !== undefined && (
                    <p><strong>דירוג:</strong> {order.rating}⭐</p>
                )}
                {order.feedback && (
                    <p><strong>משוב:</strong> {order.feedback}</p>
                )}
            </div>
        </div>
    );
}

export default OrderDetailsModal;
