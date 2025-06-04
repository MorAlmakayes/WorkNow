import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';

import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import RegisterUserPage from './pages/customer/RegisterUserPage';
import RegisterProviderPage from './pages/provider/RegisterProviderPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import ProviderDashboard from './pages/provider/ProviderDashboard';
import CustomerDashboard from './pages/customer/CustomerDashboard';
import ProviderCalendar from './pages/provider/ProviderCalendar';
import OrderNowPage from './pages/customer/OrderNowPage';
import ScheduleOrderPage from './pages/customer/ScheduleOrderPage';
import MyOrdersPage from './pages/customer/MyOrdersPage';
import FindProviderPage from './pages/customer/FindProviderPage';
import AdminRolesPage from './pages/admin/AdminRolesPage';
import AdminUsersPage from './pages/admin/AdminUsersPage';
import AdminProvidersPage from './pages/admin/AdminProvidersPage';
import AdminOrdersPage from './pages/admin/AdminOrdersPage';
import AdminStatsPage from './pages/admin/AdminStatsPage';
import AdminSupportPage from './pages/admin/AdminSupportPage';
import AdminAvailabilityPage from './pages/admin/AdminAvailabilityPage';

import ImmediateOrdersPage from './pages/provider/ImmediateOrdersPage';
import ScheduledOrdersPage from './pages/provider/ScheduledOrdersPage';
import ProviderMessagesPage from './pages/provider/ProviderMessagesPage';
import ProviderStatsPage from './pages/provider/ProviderStatsPage';
import ProviderServicesPage from './pages/provider/ProviderServicesPage';
import ProviderOrdersHistoryPage from './pages/provider/ProviderOrdersHistoryPage';
import ProviderDocumentsPage from './pages/provider/ProviderDocumentsPage';
import ProviderReportsPage from './pages/provider/ProviderReportsPage';
import ProviderAvailabilityPage from './pages/provider/ProviderAvailabilityPage';
import ProviderAnnouncementsPage from './pages/provider/ProviderAnnouncementsPage';
import ProviderPaymentsPage from './pages/provider/ProviderPaymentsPage';
import HomePage from "./pages/HomePage";
import RedirectOnLoad from './components/RedirectOnLoad';

import PrivateRoute from './components/PrivateRoute';
import Header from './components/Header';
import Footer from './components/Footer';

import './styles/theme.css';
import './styles/HomePage.css';
import './styles/OrderDetailsModal.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/ImmediateOrdersPage.css';

function LayoutWrapper({ children }) {
    const location = useLocation();
    const hideLayoutPaths = ["/", "/login", "/register", "/register/user", "/register/provider"];
    const shouldHideLayout = hideLayoutPaths.includes(location.pathname);

    return (
        <>
            {!shouldHideLayout && <Header />}
            <main className={shouldHideLayout ? 'full-screen-center' : 'homepage-full'}>
                {children}
            </main>
            {!shouldHideLayout && <Footer />}
        </>
    );
}

function AppContent() {
    return (
        <LayoutWrapper>
            <Routes>

                <Route path="/" element={<RedirectOnLoad />} />
                <Route path="/home" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/register/user" element={<RegisterUserPage />} />
                <Route path="/register/provider" element={<RegisterProviderPage />} />
                <Route path="/dashboard/admin" element={<PrivateRoute requiredType="admin"><AdminDashboard /></PrivateRoute>} />
                <Route path="/dashboard/provider" element={<PrivateRoute requiredType="provider"><ProviderDashboard /></PrivateRoute>} />
                <Route path="/dashboard/customer" element={<PrivateRoute requiredType="customer"><CustomerDashboard /></PrivateRoute>} />
                <Route path="/customer/order-now" element={<PrivateRoute requiredType="customer"><OrderNowPage /></PrivateRoute>} />
                <Route path="/customer/schedule-order" element={<PrivateRoute requiredType="customer"><ScheduleOrderPage /></PrivateRoute>} />
                <Route path="/customer/my-orders" element={<PrivateRoute requiredType="customer"><MyOrdersPage /></PrivateRoute>} />
                <Route path="/customer/find-provider" element={<PrivateRoute requiredType="customer"><FindProviderPage /></PrivateRoute>} />
                <Route path="/admin/roles" element={<PrivateRoute requiredType="admin"><AdminRolesPage /></PrivateRoute>} />
                <Route path="/admin/users" element={<PrivateRoute requiredType="admin"><AdminUsersPage /></PrivateRoute>} />
                <Route path="/admin/providers" element={<PrivateRoute requiredType="admin"><AdminProvidersPage /></PrivateRoute>} />
                <Route path="/admin/orders" element={<PrivateRoute requiredType="admin"><AdminOrdersPage /></PrivateRoute>} />
                <Route path="/admin/stats" element={<PrivateRoute requiredType="admin"><AdminStatsPage /></PrivateRoute>} />
                <Route path="/admin/support" element={<PrivateRoute requiredType="admin"><AdminSupportPage /></PrivateRoute>} />
                <Route path="/admin/schedule" element={<PrivateRoute requiredType="admin"><AdminAvailabilityPage /></PrivateRoute>} />
                <Route path="/provider/calendar" element={<PrivateRoute requiredType="provider"><ProviderCalendar /></PrivateRoute>} />
                <Route path="/provider/immediate-orders" element={<PrivateRoute requiredType="provider"><ImmediateOrdersPage /></PrivateRoute>} />
                <Route path="/provider/scheduled-orders" element={<PrivateRoute requiredType="provider"><ScheduledOrdersPage /></PrivateRoute>} />
                <Route path="/provider/messages" element={<PrivateRoute requiredType="provider"><ProviderMessagesPage /></PrivateRoute>} />
                <Route path="/provider/stats" element={<PrivateRoute requiredType="provider"><ProviderStatsPage /></PrivateRoute>} />
                <Route path="/provider/services" element={<PrivateRoute requiredType="provider"><ProviderServicesPage /></PrivateRoute>} />
                <Route path="/provider/orders" element={<PrivateRoute requiredType="provider"><ProviderOrdersHistoryPage /></PrivateRoute>} />
                <Route path="/provider/documents" element={<PrivateRoute requiredType="provider"><ProviderDocumentsPage /></PrivateRoute>} />
                <Route path="/provider/reports" element={<PrivateRoute requiredType="provider"><ProviderReportsPage /></PrivateRoute>} />
                <Route path="/provider/availability" element={<PrivateRoute requiredType="provider"><ProviderAvailabilityPage /></PrivateRoute>} />
                <Route path="/provider/announcements" element={<PrivateRoute requiredType="provider"><ProviderAnnouncementsPage /></PrivateRoute>} />
                <Route path="/provider/payments" element={<PrivateRoute requiredType="provider"><ProviderPaymentsPage /></PrivateRoute>} />
            </Routes>
        </LayoutWrapper>
    );
}

function App() {
    const [message, setMessage] = useState("");

    useEffect(() => {
        axios.get(`${process.env.REACT_APP_API || 'http://localhost:5001/api'}/message`)
            .then(res => setMessage(res.data.message))
            .catch(err => {
                console.error("Fetch error:", err);
                setMessage("שגיאה בחיבור לשרת");
            });
    }, []);

    return (
        <Router>
            <AppContent />
        </Router>
    );
}

export default App;
