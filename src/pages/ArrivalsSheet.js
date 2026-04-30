import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useGuestStore } from '../store/guestStore';
import { LogIn } from 'lucide-react';
import { toast } from 'sonner';
export default function ArrivalsSheet() {
    const guests = useGuestStore((state) => state.guests);
    const [arrivals, setArrivals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState(null);
    useEffect(() => {
        loadArrivals();
    }, []);
    const loadArrivals = async () => {
        try {
            const { data, error } = await supabase
                .from('arrivals')
                .select('*')
                .order('guest_name');
            if (error)
                throw error;
            setArrivals(data || []);
        }
        catch (error) {
            console.error('Error loading arrivals:', error);
            toast.error('Failed to load arrivals');
        }
        finally {
            setLoading(false);
        }
    };
    const handleCheckIn = async (guestId, guestName) => {
        try {
            const { error } = await supabase
                .from('arrivals')
                .upsert({
                guest_id: guestId,
                guest_name: guestName,
                check_in_time: new Date().toISOString(),
                status: 'Checked In'
            }, { onConflict: 'guest_id' });
            if (error)
                throw error;
            loadArrivals();
            toast.success(`✅ ${guestName} checked in`);
        }
        catch (error) {
            console.error('Error checking in:', error);
            toast.error('Failed to check in');
        }
    };
    const handleCheckOut = async (guestId, guestName) => {
        try {
            const { error } = await supabase
                .from('arrivals')
                .upsert({
                guest_id: guestId,
                guest_name: guestName,
                check_out_time: new Date().toISOString(),
                status: 'Checked Out'
            }, { onConflict: 'guest_id' });
            if (error)
                throw error;
            loadArrivals();
            toast.success(`✅ ${guestName} checked out`);
        }
        catch (error) {
            console.error('Error checking out:', error);
            toast.error('Failed to check out');
        }
    };
    const filteredGuests = guests.filter(g => {
        const arrival = arrivals.find(a => a.guest_id === g.id);
        const matchesSearch = g.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = !filterStatus || arrival?.status === filterStatus;
        return matchesSearch && matchesStatus;
    });
    const stats = {
        total: guests.length,
        checkedIn: arrivals.filter(a => a.status === 'Checked In').length,
        checkedOut: arrivals.filter(a => a.status === 'Checked Out').length,
        notArrived: guests.length - arrivals.filter(a => a.status !== 'Not Arrived').length
    };
    if (loading) {
        return _jsx("div", { className: "flex items-center justify-center h-screen", children: _jsx("p", { children: "Loading arrivals..." }) });
    }
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "bg-white rounded-lg p-6 shadow-sm border border-gray-200", children: [_jsxs("h1", { className: "text-3xl font-bold text-gray-800 flex items-center gap-2", children: [_jsx(LogIn, { className: "w-8 h-8 text-rose-gold" }), "Guest Arrivals & Check-in"] }), _jsx("p", { className: "text-gray-600 mt-2", children: "Track guest arrivals and departures" })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-4 gap-4", children: [_jsxs("div", { className: "bg-white rounded-lg p-6 shadow-sm border border-gray-200", children: [_jsx("p", { className: "text-gray-600 text-sm font-medium", children: "Total Guests" }), _jsx("p", { className: "text-3xl font-bold text-gray-800 mt-2", children: stats.total })] }), _jsxs("div", { className: "bg-green-50 rounded-lg p-6 shadow-sm border border-green-200", children: [_jsx("p", { className: "text-green-700 text-sm font-medium", children: "Checked In" }), _jsx("p", { className: "text-3xl font-bold text-green-700 mt-2", children: stats.checkedIn })] }), _jsxs("div", { className: "bg-blue-50 rounded-lg p-6 shadow-sm border border-blue-200", children: [_jsx("p", { className: "text-blue-700 text-sm font-medium", children: "Checked Out" }), _jsx("p", { className: "text-3xl font-bold text-blue-700 mt-2", children: stats.checkedOut })] }), _jsxs("div", { className: "bg-yellow-50 rounded-lg p-6 shadow-sm border border-yellow-200", children: [_jsx("p", { className: "text-yellow-700 text-sm font-medium", children: "Not Arrived" }), _jsx("p", { className: "text-3xl font-bold text-yellow-700 mt-2", children: stats.notArrived })] })] }), _jsx("div", { className: "bg-white rounded-lg p-6 shadow-sm border border-gray-200 space-y-4", children: _jsxs("div", { className: "flex gap-3", children: [_jsx("div", { className: "flex-1", children: _jsx("input", { type: "text", value: searchTerm, onChange: (e) => setSearchTerm(e.target.value), placeholder: "Search guest name...", className: "w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-gold outline-none" }) }), _jsxs("select", { value: filterStatus || '', onChange: (e) => setFilterStatus(e.target.value || null), className: "px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-gold outline-none", children: [_jsx("option", { value: "", children: "All Status" }), _jsx("option", { value: "Not Arrived", children: "Not Arrived" }), _jsx("option", { value: "Checked In", children: "Checked In" }), _jsx("option", { value: "Checked Out", children: "Checked Out" })] })] }) }), _jsx("div", { className: "bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden", children: _jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "w-full", children: [_jsx("thead", { className: "bg-gray-50 border-b border-gray-200", children: _jsxs("tr", { children: [_jsx("th", { className: "px-6 py-3 text-left text-sm font-semibold text-gray-700", children: "Guest Name" }), _jsx("th", { className: "px-6 py-3 text-left text-sm font-semibold text-gray-700", children: "Side" }), _jsx("th", { className: "px-6 py-3 text-left text-sm font-semibold text-gray-700", children: "Status" }), _jsx("th", { className: "px-6 py-3 text-left text-sm font-semibold text-gray-700", children: "Check-in Time" }), _jsx("th", { className: "px-6 py-3 text-left text-sm font-semibold text-gray-700", children: "Actions" })] }) }), _jsx("tbody", { className: "divide-y divide-gray-200", children: filteredGuests.map(guest => {
                                    const arrival = arrivals.find(a => a.guest_id === guest.id);
                                    const statusColor = {
                                        'Checked In': 'bg-green-100 text-green-800',
                                        'Checked Out': 'bg-blue-100 text-blue-800',
                                        'Not Arrived': 'bg-yellow-100 text-yellow-800'
                                    };
                                    return (_jsxs("tr", { className: "hover:bg-gray-50", children: [_jsx("td", { className: "px-6 py-4 text-sm font-medium text-gray-900", children: guest.name }), _jsx("td", { className: "px-6 py-4 text-sm text-gray-600", children: guest.side }), _jsx("td", { className: "px-6 py-4", children: _jsx("span", { className: `text-xs font-semibold px-3 py-1 rounded-full ${statusColor[arrival?.status] || 'bg-gray-100 text-gray-800'}`, children: arrival?.status || 'Not Arrived' }) }), _jsx("td", { className: "px-6 py-4 text-sm text-gray-600", children: arrival?.check_in_time ? new Date(arrival.check_in_time).toLocaleTimeString() : '-' }), _jsxs("td", { className: "px-6 py-4 space-x-2", children: [_jsx("button", { onClick: () => handleCheckIn(guest.id, guest.name), className: "px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-sm rounded transition", children: "Check In" }), _jsx("button", { onClick: () => handleCheckOut(guest.id, guest.name), className: "px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded transition", children: "Check Out" })] })] }, guest.id));
                                }) })] }) }) })] }));
}
