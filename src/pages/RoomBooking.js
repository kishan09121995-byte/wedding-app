import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { useGuestStore } from '../store/guestStore';
import { supabase } from '../lib/supabase';
import { Save, RotateCcw } from 'lucide-react';
import { toast } from 'sonner';
export default function RoomBooking() {
    const guests = useGuestStore((state) => state.guests);
    const [hotels, setHotels] = useState([]);
    const [guestRooms, setGuestRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [filterHotel, setFilterHotel] = useState(null);
    useEffect(() => {
        const loadData = async () => {
            const [hotelsRes, guestsRes] = await Promise.all([
                supabase.from('hotel_settings').select('*'),
                supabase.from('guests').select('id,name,city,pax_total,side,hotel_id,room_category,check_in,check_out,room_number,f4').eq('room_needed', true),
            ]);
            if (hotelsRes.data)
                setHotels(hotelsRes.data);
            if (guestsRes.data)
                setGuestRooms(guestsRes.data);
            setLoading(false);
        };
        loadData();
    }, []);
    const handleFieldChange = (guestId, field, value) => {
        setGuestRooms((prev) => prev.map((g) => (g.id === guestId ? { ...g, [field]: value } : g)));
    };
    const handleSaveAll = async () => {
        setSaving(true);
        let errors = 0;
        for (const guest of guestRooms) {
            const { error } = await supabase
                .from('guests')
                .update({
                hotel_id: guest.hotel_id,
                room_category: guest.room_category,
                check_in: guest.check_in,
                check_out: guest.check_out,
                room_number: guest.room_number,
            })
                .eq('id', guest.id);
            if (error) {
                console.error(`Error updating ${guest.name}:`, error);
                errors++;
            }
        }
        setSaving(false);
        if (errors === 0) {
            toast.success('All room assignments saved!');
        }
        else {
            toast.error(`Failed to save ${errors} guests`);
        }
    };
    const handleReset = async () => {
        const [guestsRes] = await Promise.all([
            supabase.from('guests').select('id,name,city,pax_total,side,hotel_id,room_category,check_in,check_out,room_number,f4').eq('room_needed', true),
        ]);
        if (guestsRes.data)
            setGuestRooms(guestsRes.data);
    };
    if (loading)
        return _jsx("div", { className: "p-6", children: "Loading..." });
    const hotelGrouped = new Map();
    guestRooms.forEach((guest) => {
        const hotelId = guest.hotel_id || 'unassigned';
        if (!hotelGrouped.has(hotelId))
            hotelGrouped.set(hotelId, []);
        hotelGrouped.get(hotelId).push(guest);
    });
    const filteredHotels = filterHotel ? [filterHotel] : Array.from(hotelGrouped.keys());
    const roomsNeeded = (hotelId) => {
        const groupGuests = hotelGrouped.get(hotelId) || [];
        return Math.ceil(groupGuests.reduce((sum, g) => sum + Math.ceil(g.pax_total / 2), 0));
    };
    const breakfastCount = (hotelId) => {
        const groupGuests = hotelGrouped.get(hotelId) || [];
        const leoHotels = ['LEO Resort', 'LEO Medium'];
        const hotelName = hotels.find((h) => h.id === hotelId)?.name || '';
        return groupGuests.filter((g) => leoHotels.includes(hotelName) && g.f4 === 'Yes').length;
    };
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "flex justify-between items-center", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-2xl font-bold text-gray-800", children: "Room Booking" }), _jsx("p", { className: "text-gray-600 text-sm mt-1", children: "Manage guest room assignments and dates" })] }), _jsxs("div", { className: "flex gap-2", children: [_jsxs("button", { onClick: handleReset, disabled: saving, className: "flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50", children: [_jsx(RotateCcw, { className: "w-4 h-4" }), "Reset"] }), _jsxs("button", { onClick: handleSaveAll, disabled: saving, className: "flex items-center gap-2 px-4 py-2 bg-green-100 text-green-800 rounded-lg hover:bg-green-200 transition-colors disabled:opacity-50", children: [_jsx(Save, { className: "w-4 h-4" }), saving ? 'Saving...' : 'Save All'] })] })] }), _jsxs("div", { className: "flex gap-2 flex-wrap", children: [_jsx("button", { onClick: () => setFilterHotel(null), className: `px-4 py-2 rounded-lg font-medium transition-colors ${filterHotel === null ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`, children: "All Hotels" }), hotels.map((hotel) => (_jsx("button", { onClick: () => setFilterHotel(hotel.id), className: `px-4 py-2 rounded-lg font-medium transition-colors ${filterHotel === hotel.id ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`, children: hotel.name }, hotel.id)))] }), _jsx("div", { className: "space-y-8", children: filteredHotels.map((hotelId) => {
                    const hotel = hotels.find((h) => h.id === hotelId);
                    const isUnassigned = hotelId === 'unassigned';
                    const guests = hotelGrouped.get(hotelId) || [];
                    const rooms = roomsNeeded(hotelId);
                    const breakfast = breakfastCount(hotelId);
                    return (_jsxs("div", { className: "bg-white rounded-lg p-6 shadow-sm border border-gray-200", children: [_jsxs("div", { className: "mb-4 pb-4 border-b border-gray-200", children: [_jsx("h2", { className: "text-xl font-bold text-gray-800 mb-2", children: isUnassigned ? 'Unassigned Guests' : hotel?.name }), !isUnassigned && (_jsxs("div", { className: "grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm", children: [_jsxs("div", { children: [_jsx("p", { className: "text-gray-600", children: "Guests" }), _jsx("p", { className: "text-lg font-semibold text-gray-800", children: guests.length })] }), _jsxs("div", { children: [_jsx("p", { className: "text-gray-600", children: "Rooms Needed" }), _jsx("p", { className: "text-lg font-semibold text-blue-700", children: rooms })] }), _jsxs("div", { children: [_jsx("p", { className: "text-gray-600", children: "Contracted" }), _jsx("p", { className: "text-lg font-semibold text-gray-800", children: hotel?.contracted_rooms })] }), _jsxs("div", { children: [_jsx("p", { className: "text-gray-600", children: "Breakfast Count" }), _jsx("p", { className: "text-lg font-semibold text-green-700", children: breakfast })] })] }))] }), _jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "w-full text-sm", children: [_jsx("thead", { children: _jsxs("tr", { className: "border-b border-gray-200 bg-gray-50", children: [_jsx("th", { className: "px-4 py-3 text-left font-semibold text-gray-700", children: "Name" }), _jsx("th", { className: "px-4 py-3 text-center font-semibold text-gray-700", children: "Pax" }), _jsx("th", { className: "px-4 py-3 text-left font-semibold text-gray-700", children: "Hotel" }), _jsx("th", { className: "px-4 py-3 text-left font-semibold text-gray-700", children: "Category" }), _jsx("th", { className: "px-4 py-3 text-left font-semibold text-gray-700", children: "Check-in" }), _jsx("th", { className: "px-4 py-3 text-left font-semibold text-gray-700", children: "Check-out" }), _jsx("th", { className: "px-4 py-3 text-left font-semibold text-gray-700", children: "Room #" })] }) }), _jsx("tbody", { children: guests.map((guest) => (_jsxs("tr", { className: "border-b border-gray-100 hover:bg-gray-50", children: [_jsx("td", { className: "px-4 py-3 text-gray-900 font-medium", children: guest.name }), _jsx("td", { className: "px-4 py-3 text-center text-gray-700", children: guest.pax_total }), _jsx("td", { className: "px-4 py-3", children: _jsxs("select", { value: guest.hotel_id || '', onChange: (e) => handleFieldChange(guest.id, 'hotel_id', e.target.value || null), className: "w-full px-2 py-1 border border-gray-300 rounded text-sm", children: [_jsx("option", { value: "", children: "Select Hotel" }), hotels.map((h) => (_jsx("option", { value: h.id, children: h.name }, h.id)))] }) }), _jsx("td", { className: "px-4 py-3", children: _jsxs("select", { value: guest.room_category || 'Standard', onChange: (e) => handleFieldChange(guest.id, 'room_category', e.target.value), className: "w-full px-2 py-1 border border-gray-300 rounded text-sm", children: [_jsx("option", { value: "Standard", children: "Standard" }), _jsx("option", { value: "Deluxe", children: "Deluxe" }), _jsx("option", { value: "Suite", children: "Suite" })] }) }), _jsx("td", { className: "px-4 py-3", children: _jsx("input", { type: "date", value: guest.check_in || '', onChange: (e) => handleFieldChange(guest.id, 'check_in', e.target.value), className: "w-full px-2 py-1 border border-gray-300 rounded text-sm" }) }), _jsx("td", { className: "px-4 py-3", children: _jsx("input", { type: "date", value: guest.check_out || '', onChange: (e) => handleFieldChange(guest.id, 'check_out', e.target.value), className: "w-full px-2 py-1 border border-gray-300 rounded text-sm" }) }), _jsx("td", { className: "px-4 py-3", children: _jsx("input", { type: "text", value: guest.room_number || '', onChange: (e) => handleFieldChange(guest.id, 'room_number', e.target.value), placeholder: "e.g. 101", className: "w-full px-2 py-1 border border-gray-300 rounded text-sm" }) })] }, guest.id))) })] }) })] }, hotelId));
                }) })] }));
}
