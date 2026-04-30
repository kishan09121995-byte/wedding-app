import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useGuestStore } from '../store/guestStore';
import { Edit2, Save, X, MapPin, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
export default function HotelSettings() {
    const guests = useGuestStore((state) => state.guests);
    const [hotels, setHotels] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [editData, setEditData] = useState({});
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [autoAssigning, setAutoAssigning] = useState(false);
    useEffect(() => {
        loadHotels();
    }, []);
    const loadHotels = async () => {
        try {
            const { data, error } = await supabase
                .from('hotel_settings')
                .select('*')
                .order('name');
            if (error)
                throw error;
            setHotels(data || []);
        }
        catch (error) {
            console.error('Error loading hotels:', error);
            toast.error('Failed to load hotels');
        }
        finally {
            setLoading(false);
        }
    };
    const handleAutoAssign = async () => {
        if (hotels.length === 0) {
            toast.error('No hotels configured');
            return;
        }
        setAutoAssigning(true);
        try {
            const guestsNeedingRooms = guests.filter(g => g.room_needed && g.rsvp_status === 'Confirmed');
            if (guestsNeedingRooms.length === 0) {
                toast.info('No guests need room assignment');
                setAutoAssigning(false);
                return;
            }
            // Round-robin assignment
            let hotelIndex = 0;
            for (const guest of guestsNeedingRooms) {
                const hotel = hotels[hotelIndex % hotels.length];
                await supabase
                    .from('guests')
                    .update({ hotel_id: hotel.id })
                    .eq('id', guest.id);
                hotelIndex++;
            }
            await loadHotels();
            toast.success(`✅ Auto-assigned ${guestsNeedingRooms.length} guests to hotels`);
        }
        catch (error) {
            console.error('Auto-assign error:', error);
            toast.error('Failed to auto-assign guests');
        }
        finally {
            setAutoAssigning(false);
        }
    };
    const handleEdit = (hotel) => {
        setEditingId(hotel.id);
        setEditData(hotel);
    };
    const handleSave = async () => {
        if (!editingId)
            return;
        setSaving(true);
        const { error } = await supabase
            .from('hotel_settings')
            .update(editData)
            .eq('id', editingId);
        if (error) {
            console.error('Error saving hotel:', error);
            alert('Failed to save hotel settings');
        }
        else {
            setHotels((prev) => prev.map((h) => (h.id === editingId ? { ...h, ...editData } : h)));
            setEditingId(null);
            setEditData({});
        }
        setSaving(false);
    };
    const handleCancel = () => {
        setEditingId(null);
        setEditData({});
    };
    const totalContractedRooms = hotels.reduce((sum, h) => sum + h.contracted_rooms, 0);
    const totalContractValue = hotels.reduce((sum, h) => sum + h.contracted_rooms * h.rate_per_room_night * 2, 0); // 2 nights
    const guestsNeedingRooms = guests.filter(g => g.room_needed && g.rsvp_status === 'Confirmed');
    const roomsNeeded = Math.ceil(guestsNeedingRooms.reduce((sum, g) => sum + g.pax_total, 0) / 2); // 2 per room
    if (loading)
        return _jsx("div", { className: "p-6", children: "Loading..." });
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsxs("h1", { className: "text-3xl font-bold text-gray-800 flex items-center gap-2", children: [_jsx(MapPin, { className: "w-8 h-8 text-rose-gold" }), "Hotel Settings"] }), _jsx("p", { className: "text-gray-600 text-sm mt-2", children: "Configure all hotel properties and manage room assignments" })] }), _jsxs("button", { onClick: handleAutoAssign, disabled: autoAssigning || hotels.length === 0, className: "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition disabled:opacity-50 flex items-center gap-2", children: [_jsx(Sparkles, { className: "w-5 h-5" }), autoAssigning ? 'Assigning...' : 'Auto-Assign Guests'] })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-5 gap-4", children: [_jsxs("div", { className: "bg-white rounded-lg p-6 shadow-sm border border-gray-200", children: [_jsx("p", { className: "text-gray-600 text-sm font-medium", children: "Hotels" }), _jsx("p", { className: "text-3xl font-bold text-gray-800 mt-2", children: hotels.length })] }), _jsxs("div", { className: "bg-white rounded-lg p-6 shadow-sm border border-gray-200", children: [_jsx("p", { className: "text-gray-600 text-sm font-medium", children: "Contracted" }), _jsx("p", { className: "text-3xl font-bold text-blue-700 mt-2", children: totalContractedRooms }), _jsx("p", { className: "text-xs text-gray-500 mt-1", children: "rooms" })] }), _jsxs("div", { className: "bg-white rounded-lg p-6 shadow-sm border border-gray-200", children: [_jsx("p", { className: "text-gray-600 text-sm font-medium", children: "Needed" }), _jsx("p", { className: "text-3xl font-bold text-orange-700 mt-2", children: roomsNeeded }), _jsxs("p", { className: "text-xs text-gray-500 mt-1", children: [guestsNeedingRooms.length, " guests"] })] }), _jsxs("div", { className: "bg-white rounded-lg p-6 shadow-sm border border-gray-200", children: [_jsx("p", { className: "text-gray-600 text-sm font-medium", children: "Contract Value" }), _jsxs("p", { className: "text-2xl font-bold text-green-700 mt-2", children: ["\u20B9", (totalContractValue / 100000).toFixed(1), "L"] }), _jsx("p", { className: "text-xs text-gray-500 mt-1", children: "2 nights" })] }), _jsxs("div", { className: "bg-white rounded-lg p-6 shadow-sm border border-gray-200", children: [_jsx("p", { className: "text-gray-600 text-sm font-medium", children: "Avg Rate" }), _jsxs("p", { className: "text-3xl font-bold text-purple-700 mt-2", children: ["\u20B9", hotels.length > 0 ? Math.round(hotels.reduce((sum, h) => sum + h.rate_per_room_night, 0) / hotels.length).toLocaleString() : 0] }), _jsx("p", { className: "text-xs text-gray-500 mt-1", children: "per night" })] })] }), _jsx("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-6", children: hotels.map((hotel) => {
                    const isEditing = editingId === hotel.id;
                    const current = isEditing ? editData : hotel;
                    return (_jsxs("div", { className: "bg-white rounded-lg p-6 shadow-sm border border-gray-200", children: [_jsxs("div", { className: "flex justify-between items-start mb-4", children: [_jsxs("div", { children: [_jsx("h3", { className: "text-lg font-bold text-gray-800", children: current.name || hotel.name }), _jsx("p", { className: "text-sm text-gray-600", children: current.category || hotel.category })] }), _jsx("div", { className: "flex gap-2", children: !isEditing ? (_jsx("button", { onClick: () => handleEdit(hotel), className: "p-2 hover:bg-gray-100 rounded-lg transition-colors", title: "Edit", children: _jsx(Edit2, { className: "w-4 h-4 text-gray-600" }) })) : (_jsxs(_Fragment, { children: [_jsx("button", { onClick: handleSave, disabled: saving, className: "p-2 hover:bg-green-100 rounded-lg transition-colors disabled:opacity-50", title: "Save", children: _jsx(Save, { className: "w-4 h-4 text-green-600" }) }), _jsx("button", { onClick: handleCancel, disabled: saving, className: "p-2 hover:bg-red-100 rounded-lg transition-colors disabled:opacity-50", title: "Cancel", children: _jsx(X, { className: "w-4 h-4 text-red-600" }) })] })) })] }), _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Hotel Name" }), isEditing ? (_jsx("input", { type: "text", value: editData.name || '', onChange: (e) => setEditData({ ...editData, name: e.target.value }), className: "w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" })) : (_jsx("p", { className: "text-gray-900 font-medium", children: current.name }))] }), _jsxs("div", { className: "grid grid-cols-2 gap-3", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Rate/Night (\u20B9)" }), isEditing ? (_jsx("input", { type: "number", value: editData.rate_per_room_night || 0, onChange: (e) => setEditData({ ...editData, rate_per_room_night: parseInt(e.target.value, 10) || 0 }), className: "w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" })) : (_jsxs("p", { className: "text-gray-900 font-medium", children: ["\u20B9", current.rate_per_room_night.toLocaleString()] }))] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Contracted Rooms" }), isEditing ? (_jsx("input", { type: "number", value: editData.contracted_rooms || 0, onChange: (e) => setEditData({ ...editData, contracted_rooms: parseInt(e.target.value, 10) || 0 }), className: "w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" })) : (_jsx("p", { className: "text-gray-900 font-medium", children: current.contracted_rooms }))] })] }), _jsxs("div", { className: "grid grid-cols-2 gap-3", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Default Check-in" }), isEditing ? (_jsx("input", { type: "date", value: editData.default_checkin || '', onChange: (e) => setEditData({ ...editData, default_checkin: e.target.value }), className: "w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" })) : (_jsx("p", { className: "text-gray-900 font-medium text-sm", children: current.default_checkin }))] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Default Check-out" }), isEditing ? (_jsx("input", { type: "date", value: editData.default_checkout || '', onChange: (e) => setEditData({ ...editData, default_checkout: e.target.value }), className: "w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" })) : (_jsx("p", { className: "text-gray-900 font-medium text-sm", children: current.default_checkout }))] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Breakfast Type" }), isEditing ? (_jsxs("select", { value: editData.breakfast_type || '', onChange: (e) => setEditData({ ...editData, breakfast_type: e.target.value }), className: "w-full px-3 py-2 border border-gray-300 rounded-lg text-sm", children: [_jsx("option", { value: "", children: "Select type" }), _jsx("option", { value: "Continental", children: "Continental" }), _jsx("option", { value: "Indian", children: "Indian" }), _jsx("option", { value: "Vegetarian", children: "Vegetarian" }), _jsx("option", { value: "Full", children: "Full" })] })) : (_jsx("p", { className: "text-gray-900 font-medium", children: current.breakfast_type }))] }), !isEditing && (_jsxs("div", { className: "pt-2 border-t border-gray-200", children: [_jsxs("p", { className: "text-xs text-gray-600", children: ["2-night stay: \u20B9", (current.rate_per_room_night * 2).toLocaleString(), " per room"] }), _jsxs("p", { className: "text-sm font-semibold text-green-700 mt-1", children: ["Total: \u20B9", (current.rate_per_room_night * 2 * current.contracted_rooms).toLocaleString()] })] }))] })] }, hotel.id));
                }) })] }));
}
