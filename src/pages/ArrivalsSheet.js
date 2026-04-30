import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useGuestStore } from '../store/guestStore';
import { LogIn, Printer, MapPin } from 'lucide-react';
import { toast } from 'sonner';
import '../styles/roomTags.css';
export default function ArrivalsSheet() {
    const guests = useGuestStore((state) => state.guests);
    const [arrivals, setArrivals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState(null);
    const [filterSide, setFilterSide] = useState(null);
    const [viewMode, setViewMode] = useState('list');
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
    const filteredGuests = guests
        .filter(g => {
        const arrival = arrivals.find(a => a.guest_id === g.id);
        const matchesSearch = g.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = !filterStatus || arrival?.status === filterStatus;
        const matchesSide = !filterSide || g.side === filterSide;
        return matchesSearch && matchesStatus && matchesSide;
    })
        .sort((a, b) => {
        if (a.hotel_id !== b.hotel_id)
            return (a.hotel_id || '').localeCompare(b.hotel_id || '');
        return a.name.localeCompare(b.name);
    });
    const groupedByHotelAndSide = filteredGuests.reduce((acc, guest) => {
        const hotelId = guest.hotel_id || 'No Hotel';
        const side = guest.side || 'Unknown';
        const key = `${hotelId}|${side}`;
        if (!acc[key])
            acc[key] = { hotel: hotelId, side, guests: [] };
        acc[key].guests.push(guest);
        return acc;
    }, {});
    const stats = {
        total: guests.length,
        checkedIn: arrivals.filter(a => a.status === 'Checked In').length,
        checkedOut: arrivals.filter(a => a.status === 'Checked Out').length,
        notArrived: guests.length - arrivals.filter(a => a.status !== 'Not Arrived').length
    };
    if (loading)
        return _jsx("div", { className: "flex items-center justify-center h-screen", children: _jsx("p", { children: "Loading arrivals..." }) });
    return (_jsxs("div", { className: "space-y-6", children: [_jsx("div", { className: "bg-white rounded-lg p-6 shadow-sm border border-gray-200", children: _jsxs("div", { className: "flex justify-between items-start", children: [_jsxs("div", { children: [_jsxs("h1", { className: "text-3xl font-bold text-gray-800 flex items-center gap-2", children: [_jsx(LogIn, { className: "w-8 h-8 text-rose-gold" }), "Guest Arrivals & Check-in"] }), _jsx("p", { className: "text-gray-600 mt-2", children: "Organized by Hotel & Side with Room Tags" })] }), _jsxs("button", { onClick: () => window.print(), className: "flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition", children: [_jsx(Printer, { className: "w-4 h-4" }), "Print Tags"] })] }) }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-4 gap-4", children: [_jsxs("div", { className: "bg-white rounded-lg p-6 shadow-sm border border-gray-200", children: [_jsx("p", { className: "text-gray-600 text-sm font-medium", children: "Total Guests" }), _jsx("p", { className: "text-3xl font-bold text-gray-800 mt-2", children: stats.total })] }), _jsxs("div", { className: "bg-green-50 rounded-lg p-6 shadow-sm border border-green-200", children: [_jsx("p", { className: "text-green-700 text-sm font-medium", children: "Checked In" }), _jsx("p", { className: "text-3xl font-bold text-green-700 mt-2", children: stats.checkedIn })] }), _jsxs("div", { className: "bg-blue-50 rounded-lg p-6 shadow-sm border border-blue-200", children: [_jsx("p", { className: "text-blue-700 text-sm font-medium", children: "Checked Out" }), _jsx("p", { className: "text-3xl font-bold text-blue-700 mt-2", children: stats.checkedOut })] }), _jsxs("div", { className: "bg-yellow-50 rounded-lg p-6 shadow-sm border border-yellow-200", children: [_jsx("p", { className: "text-yellow-700 text-sm font-medium", children: "Not Arrived" }), _jsx("p", { className: "text-3xl font-bold text-yellow-700 mt-2", children: stats.notArrived })] })] }), _jsx("div", { className: "bg-white rounded-lg p-6 shadow-sm border border-gray-200 space-y-4", children: _jsxs("div", { className: "flex gap-3 flex-wrap", children: [_jsx("div", { className: "flex-1 min-w-[200px]", children: _jsx("input", { type: "text", value: searchTerm, onChange: (e) => setSearchTerm(e.target.value), placeholder: "Search guest name...", className: "w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-gold outline-none" }) }), _jsxs("select", { value: filterSide || '', onChange: (e) => setFilterSide(e.target.value || null), className: "px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-gold outline-none", children: [_jsx("option", { value: "", children: "All Sides" }), _jsx("option", { value: "Bride", children: "Bride Side" }), _jsx("option", { value: "Groom", children: "Groom Side" })] }), _jsxs("select", { value: filterStatus || '', onChange: (e) => setFilterStatus(e.target.value || null), className: "px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-gold outline-none", children: [_jsx("option", { value: "", children: "All Status" }), _jsx("option", { value: "Not Arrived", children: "Not Arrived" }), _jsx("option", { value: "Checked In", children: "Checked In" }), _jsx("option", { value: "Checked Out", children: "Checked Out" })] }), _jsxs("div", { className: "flex gap-2", children: [_jsx("button", { onClick: () => setViewMode('list'), className: `px-4 py-2 rounded-lg font-medium transition ${viewMode === 'list'
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`, children: "List View" }), _jsx("button", { onClick: () => setViewMode('tags'), className: `px-4 py-2 rounded-lg font-medium transition ${viewMode === 'tags'
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`, children: "Room Tags" })] })] }) }), viewMode === 'list' && (_jsx("div", { className: "space-y-6", children: Object.entries(groupedByHotelAndSide).map(([key, { hotel, side, guests: sideGuests }]) => (_jsxs("div", { className: "bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden", children: [_jsx("div", { className: "bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-4 text-white", children: _jsxs("h2", { className: "text-xl font-bold flex items-center gap-2", children: [_jsx(MapPin, { className: "w-5 h-5" }), hotel, " \u2022 ", side, " Side (", sideGuests.length, " guests)"] }) }), _jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "w-full", children: [_jsx("thead", { className: "bg-gray-50 border-b border-gray-200", children: _jsxs("tr", { children: [_jsx("th", { className: "px-6 py-3 text-left text-sm font-semibold text-gray-700", children: "Guest Name" }), _jsx("th", { className: "px-6 py-3 text-left text-sm font-semibold text-gray-700", children: "Room #" }), _jsx("th", { className: "px-6 py-3 text-left text-sm font-semibold text-gray-700", children: "Pax" }), _jsx("th", { className: "px-6 py-3 text-left text-sm font-semibold text-gray-700", children: "Status" }), _jsx("th", { className: "px-6 py-3 text-left text-sm font-semibold text-gray-700", children: "Check-in Time" }), _jsx("th", { className: "px-6 py-3 text-left text-sm font-semibold text-gray-700", children: "Actions" })] }) }), _jsx("tbody", { className: "divide-y divide-gray-200", children: sideGuests.map(guest => {
                                            const arrival = arrivals.find(a => a.guest_id === guest.id);
                                            const statusColor = {
                                                'Checked In': 'bg-green-100 text-green-800',
                                                'Checked Out': 'bg-blue-100 text-blue-800',
                                                'Not Arrived': 'bg-yellow-100 text-yellow-800'
                                            };
                                            return (_jsxs("tr", { className: "hover:bg-gray-50", children: [_jsx("td", { className: "px-6 py-4 text-sm font-medium text-gray-900", children: guest.name }), _jsx("td", { className: "px-6 py-4 text-sm font-bold text-blue-600", children: guest.room_number || '-' }), _jsx("td", { className: "px-6 py-4 text-sm text-gray-600", children: guest.pax_total }), _jsx("td", { className: "px-6 py-4", children: _jsx("span", { className: `text-xs font-semibold px-3 py-1 rounded-full ${statusColor[arrival?.status] || 'bg-gray-100 text-gray-800'}`, children: arrival?.status || 'Not Arrived' }) }), _jsx("td", { className: "px-6 py-4 text-sm text-gray-600", children: arrival?.check_in_time ? new Date(arrival.check_in_time).toLocaleTimeString() : '-' }), _jsxs("td", { className: "px-6 py-4 space-x-2", children: [_jsx("button", { onClick: () => handleCheckIn(guest.id, guest.name), className: "px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-xs rounded transition", children: "In" }), _jsx("button", { onClick: () => handleCheckOut(guest.id, guest.name), className: "px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded transition", children: "Out" })] })] }, guest.id));
                                        }) })] }) })] }, key))) })), viewMode === 'tags' && (_jsxs("div", { className: "room-tags-outer-container", children: [Object.entries(groupedByHotelAndSide).map(([key, { hotel, side, guests: sideGuests }]) => (_jsxs("div", { children: [_jsxs("h3", { className: "room-tags-section-header", children: [hotel, " \u2022 ", side, " Side (", sideGuests.length, " guests)"] }), _jsx("div", { className: "room-tags-container", children: sideGuests.map(guest => {
                                    const arrival = arrivals.find(a => a.guest_id === guest.id);
                                    const sideClass = side === 'Bride' ? 'bride-side' : 'groom-side';
                                    const sideBadgeClass = side === 'Bride' ? 'bride' : 'groom';
                                    const roomNumberValue = guest.room_number;
                                    return (_jsx("div", { className: "room-tag-wrapper", children: _jsxs("div", { className: `room-tag ${sideClass}`, children: [_jsx("div", { className: "room-tag-header", children: "Welcome to Kishan & Megha's Wedding" }), _jsx("div", { className: "room-tag-name", children: guest.name }), _jsx("div", { className: "room-tag-divider" }), roomNumberValue ? (_jsxs("div", { className: "room-tag-number", children: ["#", roomNumberValue] })) : (_jsx("div", { className: "room-tag-number empty", children: "______" })), _jsx("div", { className: `room-tag-side ${sideBadgeClass}`, children: side === 'Bride' ? "Bride's Side" : "Groom's Side" }), _jsxs("div", { className: "room-tag-details", children: [_jsxs("div", { className: "room-tag-pax", children: [guest.pax_total, " ", guest.pax_total === 1 ? 'Guest' : 'Guests'] }), arrival && (_jsx("div", { className: "room-tag-status", children: arrival.status }))] })] }) }, guest.id));
                                }) })] }, key))), _jsxs("div", { className: "mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg print:hidden", children: [_jsx("p", { className: "text-sm text-blue-800 font-semibold", children: "\uD83D\uDDA8\uFE0F Print Instructions:" }), _jsxs("ul", { className: "text-xs text-blue-700 mt-2 space-y-1 ml-4 list-disc", children: [_jsxs("li", { children: ["Ensure printer is set to ", _jsx("strong", { children: "A4 paper" })] }), _jsxs("li", { children: ["Set margins to ", _jsx("strong", { children: "10mm" }), " on all sides"] }), _jsxs("li", { children: ["Enable ", _jsx("strong", { children: "\"Background graphics\"" }), " to print color tints"] }), _jsx("li", { children: "Use a guillotine cutter or sharp scissors along the 2mm double borders" }), _jsx("li", { children: "Each card is exactly 105mm \u00D7 148mm (A6 size) \u2014 4 cards per A4 sheet" }), _jsx("li", { children: "Handwrite missing room numbers on the ______ line if needed" })] })] })] }))] }));
}
