import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../store/authStore';
import { LayoutDashboard, Users, UtensilsCrossed, Building2, Hotel, DollarSign, Calendar, Image, Share2, Menu, X, LogOut, Heart, Store, } from 'lucide-react';
import Dashboard from '../pages/Dashboard';
import MasterRSVP from '../pages/MasterRSVP';
import PlateCount from '../pages/PlateCount';
import HotelSettings from '../pages/HotelSettings';
import RoomBooking from '../pages/RoomBooking';
import HotelBilling from '../pages/HotelBilling';
import Budget from '../pages/Budget';
import Timeline from '../pages/Timeline';
import PhotoGallery from '../pages/PhotoGallery';
import SocialHub from '../pages/SocialHub';
import VendorTracker from '../pages/VendorTracker';
const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'rsvp', label: 'Master RSVP', icon: Users },
    { id: 'plate-count', label: 'Plate Count', icon: UtensilsCrossed },
    { id: 'hotel-settings', label: 'Hotel Settings', icon: Building2 },
    { id: 'room-booking', label: 'Room Booking', icon: Hotel },
    { id: 'hotel-billing', label: 'Hotel Billing', icon: DollarSign },
    { id: 'budget', label: 'Budget', icon: DollarSign },
    { id: 'timeline', label: 'Timeline', icon: Calendar },
    { id: 'photos', label: 'Photos', icon: Image },
    { id: 'social', label: 'Social Hub', icon: Share2 },
    { id: 'vendors', label: 'Vendors', icon: Store },
];
export default function MainLayout() {
    const [currentPage, setCurrentPage] = useState('dashboard');
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const { user, setUser } = useAuthStore();
    const handleLogout = async () => {
        await supabase.auth.signOut();
        setUser(null);
    };
    const renderPage = () => {
        switch (currentPage) {
            case 'dashboard':
                return _jsx(Dashboard, {});
            case 'rsvp':
                return _jsx(MasterRSVP, {});
            case 'plate-count':
                return _jsx(PlateCount, {});
            case 'hotel-settings':
                return _jsx(HotelSettings, {});
            case 'room-booking':
                return _jsx(RoomBooking, {});
            case 'hotel-billing':
                return _jsx(HotelBilling, {});
            case 'budget':
                return _jsx(Budget, {});
            case 'timeline':
                return _jsx(Timeline, {});
            case 'photos':
                return _jsx(PhotoGallery, {});
            case 'social':
                return _jsx(SocialHub, {});
            case 'vendors':
                return _jsx(VendorTracker, {});
            default:
                return _jsx(Dashboard, {});
        }
    };
    return (_jsxs("div", { className: "flex h-screen bg-gray-50", children: [_jsxs("div", { className: `${sidebarOpen ? 'w-64' : 'w-0'} bg-mauve text-white transition-all duration-300 overflow-hidden flex flex-col`, children: [_jsxs("div", { className: "p-6 border-b border-mauve/50", children: [_jsxs("div", { className: "flex items-center gap-2 mb-2", children: [_jsx(Heart, { className: "w-6 h-6 fill-rose-gold text-rose-gold" }), _jsx("h1", { className: "text-xl font-bold", children: "Kishan & Megha" })] }), _jsx("p", { className: "text-xs text-mauve/70", children: "June 21\u201322, 2026" })] }), _jsx("nav", { className: "flex-1 overflow-y-auto p-4", children: navItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = currentPage === item.id;
                            return (_jsxs("button", { onClick: () => {
                                    setCurrentPage(item.id);
                                    if (window.innerWidth < 768)
                                        setSidebarOpen(false);
                                }, className: `w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition text-sm ${isActive
                                    ? 'bg-rose-gold text-white'
                                    : 'hover:bg-mauve/50 text-mauve/90'}`, children: [_jsx(Icon, { className: "w-4 h-4" }), _jsx("span", { children: item.label })] }, item.id));
                        }) }), _jsxs("div", { className: "p-4 border-t border-mauve/50 space-y-2", children: [_jsx("p", { className: "text-xs text-mauve/70 px-4", children: "Logged in as:" }), _jsx("p", { className: "text-xs text-mauve/90 px-4 truncate", children: user?.email }), _jsxs("button", { onClick: handleLogout, className: "w-full flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-mauve/50 text-sm transition text-mauve/90", children: [_jsx(LogOut, { className: "w-4 h-4" }), _jsx("span", { children: "Logout" })] })] })] }), _jsxs("div", { className: "flex-1 flex flex-col overflow-hidden", children: [_jsxs("div", { className: "bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between", children: [_jsx("button", { onClick: () => setSidebarOpen(!sidebarOpen), className: "md:hidden p-2 hover:bg-gray-100 rounded-lg", children: sidebarOpen ? (_jsx(X, { className: "w-6 h-6" })) : (_jsx(Menu, { className: "w-6 h-6" })) }), _jsx("h2", { className: "text-2xl font-bold text-gray-800", children: navItems.find((item) => item.id === currentPage)?.label }), _jsx("div", { className: "text-sm text-gray-600", children: new Date().toLocaleDateString('en-IN', {
                                    weekday: 'short',
                                    year: 'numeric',
                                    month: 'short',
                                    day: 'numeric',
                                }) })] }), _jsx("div", { className: "flex-1 overflow-auto", children: _jsx("div", { className: "p-6", children: renderPage() }) })] })] }));
}
