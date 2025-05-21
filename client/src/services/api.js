import axios from 'axios';

// === Base API configuration ===
const API = axios.create({
    baseURL: process.env.REACT_APP_API || 'http://localhost:5001/api',
});

// === Auth ===
export const loginUser = async (identifier, password) => {
    try {
        const response = await API.post('/auth/login', { identifier, password });
        return response.data;
    } catch (err) {
        console.error("Login error:", err.response?.data || err);
        throw new Error(err.response?.data?.error || 'שגיאה בהתחברות');
    }
};

export const registerUser = async (name, email, password, phone, id) => {
    try {
        const response = await API.post('/auth/register-user', { name, email, password, phone, id });
        return response.data;
    } catch (err) {
        console.error("Registration error:", err.response?.data || err);
        throw new Error(err.response?.data?.error || 'שגיאה בהרשמה');
    }
};

export const registerProvider = async (name, email, password, phone, id, roles) => {
    try {
        const response = await API.post('/auth/register-provider', { name, email, password, phone, id, roles });
        return response.data;
    } catch (err) {
        console.error("Provider registration error:", err.response?.data || err);
        throw new Error(err.response?.data?.error || 'שגיאה בהרשמת ספק');
    }
};

export const checkEmailExists = async (email) => {
    try {
        const response = await API.post('/auth/check-email', { email });
        return response.data.exists;
    } catch (err) {
        console.error("Check email exists error:", err.response?.data || err);
        throw new Error(err.response?.data?.error || 'שגיאה בבדיקת האימייל');
    }
};

// === Roles ===
export const getAllRoles = async () => {
    try {
        const response = await API.get('/roles/');
        console.log("🔍 Full response from /roles/:", response.data);

        if (Array.isArray(response.data)) {
            return response.data;
        } else {
            console.warn("⚠️ roles is not an array:", response.data);
            return [];
        }
    } catch (err) {
        console.error("❌ Get roles error:", err.response?.data || err);
        throw new Error('שגיאה בטעינת התחומים');
    }
};






export const addRole = async (name) => {
    try {
        const response = await API.post('/roles/add', { name });
        return response.data;
    } catch (err) {
        console.error("Add role error:", err.response?.data || err);
        throw new Error('שגיאה בהוספת תחום');
    }
};

export const deleteRole = async (name) => {
    try {
        const response = await API.post('/roles/delete', { name });
        return response.data;
    } catch (err) {
        console.error("Delete role error:", err.response?.data || err);
        throw new Error('שגיאה במחיקת תחום');
    }
};

export const toggleRoleActiveStatus = async (name) => {
    try {
        const response = await API.post('/roles/toggle', { name });
        return response.data;
    } catch (err) {
        console.error("Toggle role status error:", err.response?.data || err);
        throw new Error('שגיאה בשינוי סטטוס תחום');
    }
};

// === Orders ===
export const createInstantOrder = async (serviceType, location) => {
    const customerId = localStorage.getItem('user_id');
    const now = new Date().toISOString();
    try {
        const response = await API.post('/customer/orders/immediate', {
            service_type: serviceType,
            location,
            datetime: now,
            customer_id: customerId
        });
        return response.data;
    } catch (err) {
        console.error("Instant order creation error:", err.response?.data || err);
        throw new Error(err.response?.data?.error || 'שגיאה בהזמנת שירות מיידי');
    }
};

export const bookScheduledOrder = async (providerId, serviceType, datetime, location) => {
    const customerId = localStorage.getItem('user_id');
    try {
        const response = await API.post('/customer/book', {
            customer_id: customerId,
            provider_id: providerId,
            service_type: serviceType,
            datetime,
            location
        });
        return response.data;
    } catch (err) {
        console.error("Scheduled order creation error:", err.response?.data || err);
        throw new Error(err.response?.data?.error || 'שגיאה בהזמנת שירות עתידי');
    }
};

export const getMyOrders = async (customerId) => {
    try {
        const response = await API.get(`/customer/orders/${customerId}`);
        return response.data.orders;
    } catch (err) {
        console.error("Get my orders error:", err.response?.data || err);
        throw new Error('שגיאה בטעינת ההזמנות');
    }
};

// === Provider ===
export const getAvailableProvidersByDate = async (role, date, location) => {
    try {
        const response = await API.post('/provider/available-by-date', {
            role,
            date,
            location
        });
        return response.data.providers;
    } catch (err) {
        console.error("Get available providers by date error:", err.response?.data || err);
        throw new Error('שגיאה בטעינת ספקים זמינים');
    }
};

export const getAllProviders = async () => {
    try {
        const response = await API.get('/provider/all');
        return response.data.providers;
    } catch (err) {
        console.error("Get all providers error:", err.response?.data || err);
        throw new Error('שגיאה בטעינת רשימת הספקים');
    }
};

export const approveProvider = async (provider_id) => {
    try {
        const response = await API.post('/provider/approve', { provider_id });
        return response.data;
    } catch (err) {
        console.error("Approve provider error:", err.response?.data || err);
        throw new Error('שגיאה באישור הספק');
    }
};

export const rejectProvider = async (provider_id) => {
    try {
        const response = await API.post('/provider/reject', { provider_id });
        return response.data;
    } catch (err) {
        console.error("Reject provider error:", err.response?.data || err);
        throw new Error('שגיאה בדחיית הספק');
    }
};

export const updateProviderStatus = async (provider_id, status) => {
    try {
        const response = await API.post('/provider/status', { provider_id, status });
        return response.data;
    } catch (err) {
        console.error("Update provider status error:", err.response?.data || err);
        throw new Error('שגיאה בעדכון סטטוס הספק');
    }
};

export const getOrdersByProvider = async (provider_id) => {
    try {
        const response = await API.get(`/provider/orders/${provider_id}`);
        return response.data.orders;
    } catch (err) {
        console.error("Get provider orders error:", err.response?.data || err);
        throw new Error('שגיאה בטעינת ההזמנות של הספק');
    }
};

// === Admin / Users ===
export const getUsers = async () => {
    try {
        const response = await API.get('/admin/users');
        return response.data.users;
    } catch (err) {
        console.error("Get users error:", err.response?.data || err);
        throw new Error('שגיאה בטעינת המשתמשים');
    }
};

export const blockUser = async (userId, blockStatus) => {
    try {
        const response = await API.post('/admin/block-user', { userId, blockStatus });
        return response.data;
    } catch (err) {
        console.error("Block user error:", err.response?.data || err);
        throw new Error('שגיאה בחסימת המשתמש');
    }
};

export const updateUser = async (userId, userData) => {
    try {
        const response = await API.post('/admin/update-user', { userId, userData });
        return response.data;
    } catch (err) {
        console.error("Update user error:", err.response?.data || err);
        throw new Error('שגיאה בעדכון פרטי המשתמש');
    }
};

// === Admin / Orders ===
export const getAllOrders = async () => {
    try {
        const response = await API.get('/admin/orders');
        return response.data.orders;
    } catch (err) {
        console.error("Get all orders error:", err.response?.data || err);
        throw new Error('שגיאה בטעינת ההזמנות');
    }
};

// === Stats ===
export const getStats = async () => {
    try {
        const response = await API.get('/admin/stats');
        return response.data;
    } catch (err) {
        console.error("Get stats error:", err.response?.data || err);
        throw new Error('שגיאה בטעינת סטטיסטיקות');
    }
};

// === Availability (Admin Site Settings) ===
export const getAvailabilitySettings = async () => {
    try {
        const response = await API.get('/admin/availability');
        return response.data;
    } catch (err) {
        console.error("Get availability error:", err.response?.data || err);
        throw new Error('שגיאה בטעינת זמינות האתר');
    }
};

export const updateAvailabilitySettings = async (settings) => {
    try {
        const response = await API.post('/admin/availability', settings);
        return response.data;
    } catch (err) {
        console.error("Update availability error:", err.response?.data || err);
        throw new Error('שגיאה בעדכון זמינות האתר');
    }
};

// === Orders (Provider Immediate/Scheduled) ===
export const getImmediateOrders = async () => {
    const providerId = localStorage.getItem('user_id');
    try {
        const response = await API.get(`/provider/orders/immediate/${providerId}`);
        return response.data.orders;
    } catch (err) {
        console.error("Get immediate orders error:", err.response?.data || err);
        throw new Error('שגיאה בטעינת קריאות מיידיות');
    }
};

export const getScheduledOrders = async () => {
    const providerId = localStorage.getItem('user_id');
    try {
        const response = await API.get(`/provider/orders/${providerId}`);
        const allOrders = response.data.orders || [];
        return allOrders.filter(order => {
            try {
                return new Date(order.datetime) > new Date();
            } catch {
                return false;
            }
        });
    } catch (err) {
        console.error("Get scheduled orders error:", err.response?.data || err);
        throw new Error('שגיאה בטעינת קריאות עתידיות');
    }
};

export const acceptImmediateOrder = async (orderId) => {
    const providerId = localStorage.getItem('user_id');
    try {
        const response = await API.post('/provider/accept-order', { orderId, providerId });
        return response.data;
    } catch (err) {
        console.error("Accept order error:", err.response?.data || err);
        throw new Error('שגיאה באישור הקריאה');
    }
};

export const rejectImmediateOrder = async (orderId) => {
    try {
        const response = await API.post('/provider/reject-order', { orderId });
        return response.data;
    } catch (err) {
        console.error("Reject order error:", err.response?.data || err);
        throw new Error('שגיאה בדחיית הקריאה');
    }
};

// === Provider Dashboard Features ===

// 📢 Announcements
export const getProviderAnnouncements = async () => {
    const providerId = localStorage.getItem('user_id');
    try {
        const response = await API.get(`/provider/announcements/${providerId}`);
        return response.data.announcements;
    } catch (err) {
        console.error("Get announcements error:", err.response?.data || err);
        throw new Error('שגיאה בטעינת ההודעות');
    }
};

// 📅 Availability
export const getAvailabilitySettingsForProvider = async () => {
    const providerId = localStorage.getItem('user_id');
    try {
        const response = await API.get(`/provider/availability/${providerId}`);
        return response.data?.availability || {};
    } catch (err) {
        console.error("Get provider availability error:", err.response?.data || err);
        throw new Error('שגיאה בטעינת זמינות הספק');
    }
};



export const updateAvailabilitySettingsForProvider = async (settings) => {
    const providerId = localStorage.getItem('user_id');
    if (!providerId) throw new Error('לא נמצא מזהה ספק');

    try {
        const response = await API.post(`/provider/availability/${providerId}`, {
            availability: settings
        });

        if (!response.data || response.status !== 200) {
            throw new Error('השרת לא החזיר תשובה תקינה');
        }

        return response.data;
    } catch (err) {
        console.error("Update provider availability error:", err.response?.data || err);
        throw new Error(err.response?.data?.error || 'שגיאה בעדכון זמינות הספק');
    }
};


// 📨 Messages
export const getMessagesForProvider = async () => {
    const providerId = localStorage.getItem('user_id');
    try {
        const response = await API.get(`/provider/messages/${providerId}`);
        return response.data.messages;
    } catch (err) {
        console.error("Get provider messages error:", err.response?.data || err);
        throw new Error('שגיאה בטעינת ההודעות');
    }
};

export const markMessageAsHandled = async (messageId) => {
    try {
        const response = await API.post(`/provider/messages/mark-handled`, { messageId });
        return response.data;
    } catch (err) {
        console.error("Mark message handled error:", err.response?.data || err);
        throw new Error('שגיאה בעדכון סטטוס ההודעה');
    }
};

// 📊 Stats
export const getProviderStats = async () => {
    const providerId = localStorage.getItem('user_id');
    try {
        const response = await API.get(`/provider/stats/${providerId}`);
        return response.data;
    } catch (err) {
        console.error("Get provider stats error:", err.response?.data || err);
        throw new Error('שגיאה בטעינת הסטטיסטיקות');
    }
};

// 🛠 Services
export const getMyServices = async () => {
    const providerId = localStorage.getItem('user_id');
    try {
        const response = await API.get(`/provider/services/${providerId}`);
        return response.data.services;
    } catch (err) {
        console.error("Get provider services error:", err.response?.data || err);
        throw new Error('שגיאה בטעינת השירותים');
    }
};

export const deleteServiceById = async (serviceId) => {
    try {
        const response = await API.delete(`/provider/services/${serviceId}`);
        return response.data;
    } catch (err) {
        console.error("Delete service error:", err.response?.data || err);
        throw new Error('שגיאה במחיקת שירות');
    }
};

// 📈 Reports
export const getProviderReports = async (from, to) => {
    const providerId = localStorage.getItem('user_id');
    try {
        const response = await API.post(`/provider/reports/${providerId}`, { from, to });
        return response.data;
    } catch (err) {
        console.error("Get provider reports error:", err.response?.data || err);
        throw new Error('שגיאה בטעינת הדוחות');
    }
};
