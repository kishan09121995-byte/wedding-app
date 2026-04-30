import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { supabase } from './lib/supabase';
import { useAuthStore } from './store/authStore';
import { useGuestStore } from './store/guestStore';
import Auth from './pages/Auth';
import MainLayout from './layouts/MainLayout';
import RSVPPortal from './pages/RSVPPortal';
import PhotoPortal from './pages/PhotoPortal';
import RegisterBride from './pages/RegisterBride';
import RegisterGroom from './pages/RegisterGroom';
import QRPhotoRegistration from './pages/QRPhotoRegistration';
import PasswordReset from './pages/PasswordReset';
import AdminPanel from './pages/AdminPanel';
import SetupWizard from './pages/SetupWizard';
import SetupRSVP from './pages/SetupRSVP';
import { Loader } from 'lucide-react';
function AppContent() {
    const { user, loading, setUser, setLoading } = useAuthStore();
    const { setGuests } = useGuestStore();
    const [appReady, setAppReady] = useState(false);
    const location = useLocation();
    const isRsvpPage = location.pathname.startsWith('/rsvp/');
    useEffect(() => {
        // Check session
        const checkSession = async () => {
            try {
                const { data: { session }, } = await supabase.auth.getSession();
                setUser(session?.user || null);
            }
            catch (error) {
                console.error('Session error:', error);
            }
            finally {
                setLoading(false);
            }
        };
        checkSession();
        // Subscribe to auth changes
        const { data: { subscription }, } = supabase.auth.onAuthStateChange((_, session) => {
            setUser(session?.user || null);
        });
        return () => subscription?.unsubscribe();
    }, [setUser, setLoading]);
    useEffect(() => {
        // Load guests when user is authenticated or if on RSVP page
        if ((user || isRsvpPage) && !loading) {
            loadGuests();
        }
        else if (!user && !loading && !isRsvpPage) {
            setAppReady(true);
        }
    }, [user, loading, isRsvpPage]);
    const loadGuests = async () => {
        try {
            const { data, error } = await supabase
                .from('guests')
                .select('*')
                .order('name');
            if (error)
                throw error;
            setGuests(data || []);
        }
        catch (error) {
            console.error('Error loading guests:', error);
        }
        finally {
            setAppReady(true);
        }
    };
    // Allow RSVP page even without authentication
    if (isRsvpPage) {
        return _jsx(RSVPPortal, {});
    }
    if (loading) {
        return (_jsx("div", { className: "flex items-center justify-center h-screen bg-cream", children: _jsxs("div", { className: "text-center", children: [_jsx(Loader, { className: "w-8 h-8 text-rose-gold animate-spin mx-auto mb-4" }), _jsx("p", { className: "text-gray-600", children: "Loading wedding app..." })] }) }));
    }
    if (!user) {
        return _jsx(Auth, {});
    }
    if (!appReady) {
        return (_jsx("div", { className: "flex items-center justify-center h-screen bg-cream", children: _jsxs("div", { className: "text-center", children: [_jsx(Loader, { className: "w-8 h-8 text-rose-gold animate-spin mx-auto mb-4" }), _jsx("p", { className: "text-gray-600", children: "Setting up your wedding app..." })] }) }));
    }
    return _jsx(MainLayout, {});
}
function App() {
    return (_jsx(BrowserRouter, { children: _jsxs(Routes, { children: [_jsx(Route, { path: "/rsvp/:token", element: _jsx(RSVPPortal, {}) }), _jsx(Route, { path: "/photo-portal", element: _jsx(PhotoPortal, {}) }), _jsx(Route, { path: "/register/bride", element: _jsx(RegisterBride, {}) }), _jsx(Route, { path: "/register/groom", element: _jsx(RegisterGroom, {}) }), _jsx(Route, { path: "/qr-photos", element: _jsx(QRPhotoRegistration, {}) }), _jsx(Route, { path: "/reset-password", element: _jsx(PasswordReset, {}) }), _jsx(Route, { path: "/setup", element: _jsx(SetupWizard, {}) }), _jsx(Route, { path: "/setup-rsvp", element: _jsx(SetupRSVP, {}) }), _jsx(Route, { path: "/admin", element: _jsx(AdminPanel, {}) }), _jsx(Route, { path: "/*", element: _jsx(AppContent, {}) })] }) }));
}
export default App;
