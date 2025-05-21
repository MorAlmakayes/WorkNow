import React, { useEffect, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { getScheduledOrders } from '../../services/api';

function ProviderCalendar() {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const providerId = localStorage.getItem('user_id');

    // Fetch upcoming bookings for the provider
    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        try {
            const data = await getScheduledOrders(providerId);
            const formatted = data.map(order => ({
                id: order._id,
                title: `${order.serviceType} - ${order.status}`,
                start: order.datetime,
                extendedProps: {
                    location: order.location
                }
            }));
            setEvents(formatted);
        } catch (err) {
            alert('שגיאה בטעינת היומן');
        } finally {
            setLoading(false);
        }
    };

    const handleEventClick = (info) => {
        alert(
            `📅 הזמנה ל-${info.event.title}\n\nמיקום: ${info.event.extendedProps.location}\nתאריך: ${new Date(info.event.start).toLocaleString()}`
        );
    };

    return (
        <div className="container">
            <h2>📆 יומן אישי</h2>
            {loading && <p>⏳ טוען הזמנות...</p>}

            {!loading && (
                <FullCalendar
                    plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                    initialView="timeGridWeek"
                    locale='he'
                    events={events}
                    eventClick={handleEventClick}
                    height="auto"
                />
            )}
        </div>
    );
}

export default ProviderCalendar;
