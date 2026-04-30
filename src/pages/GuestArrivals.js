import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { EditableTable } from '../components/EditableTable';
import { toast } from 'sonner';
export default function GuestArrivals() {
    const [arrivals, setArrivals] = useState([]);
    const [guests, setGuests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAddForm, setShowAddForm] = useState(false);
    const [newArrival, setNewArrival] = useState({
        guest_id: '',
        arrival_date: '',
        arrival_time: '',
        transport_type: 'Self',
        driver_assigned: '',
        vehicle_number: '',
        status: 'Pending',
        notes: '',
    });
    useEffect(() => {
        loadData();
    }, []);
    const loadData = async () => {
        try {
            setLoading(true);
            const [arrivalRes, guestRes] = await Promise.all([
                supabase.from('guest_arrivals').select('*').order('arrival_date', { ascending: true }),
                supabase.from('guests').select('id, name'),
            ]);
            if (arrivalRes.error)
                throw arrivalRes.error;
            if (guestRes.error)
                throw guestRes.error;
            const arrivalsWithNames = arrivalRes.data.map((a) => ({
                ...a,
                guest_name: guestRes.data.find((g) => g.id === a.guest_id)?.name || 'Unknown',
            }));
            setArrivals(arrivalsWithNames);
            setGuests(guestRes.data || []);
        }
        catch (err) {
            toast.error(err.message);
        }
        finally {
            setLoading(false);
        }
    };
    const handleUpdate = async (id, field, value) => {
        try {
            const { error } = await supabase
                .from('guest_arrivals')
                .update({ [field]: value, updated_at: new Date().toISOString() })
                .eq('id', id);
            if (error)
                throw error;
            setArrivals((prev) => prev.map((a) => (a.id === id ? { ...a, [field]: value } : a)));
            toast.success('Updated');
        }
        catch (err) {
            toast.error(err.message);
        }
    };
    const handleDelete = async (id) => {
        try {
            const { error } = await supabase.from('guest_arrivals').delete().eq('id', id);
            if (error)
                throw error;
            setArrivals((prev) => prev.filter((a) => a.id !== id));
            toast.success('Deleted');
        }
        catch (err) {
            toast.error(err.message);
        }
    };
    const handleAdd = async () => {
        try {
            if (!newArrival.guest_id) {
                toast.error('Guest is required');
                return;
            }
            const { error } = await supabase
                .from('guest_arrivals')
                .insert([newArrival]);
            if (error)
                throw error;
            loadData();
            setNewArrival({
                guest_id: '',
                arrival_date: '',
                arrival_time: '',
                transport_type: 'Self',
                driver_assigned: '',
                vehicle_number: '',
                status: 'Pending',
                notes: '',
            });
            setShowAddForm(false);
            toast.success('Arrival added');
        }
        catch (err) {
            toast.error(err.message);
        }
    };
    const columns = [
        { key: 'guest_name', label: 'Guest', editable: false },
        { key: 'arrival_date', label: 'Arrival Date', type: 'date' },
        { key: 'arrival_time', label: 'Arrival Time', type: 'text' },
        {
            key: 'transport_type',
            label: 'Transport Type',
            type: 'select',
            options: [
                { label: 'Self', value: 'Self' },
                { label: 'Train', value: 'Train' },
                { label: 'Flight', value: 'Flight' },
                { label: 'Arranged Pickup', value: 'Arranged Pickup' },
            ],
        },
        { key: 'driver_assigned', label: 'Driver Assigned', type: 'text' },
        { key: 'vehicle_number', label: 'Vehicle Number', type: 'text' },
        {
            key: 'status',
            label: 'Status',
            type: 'select',
            options: [
                { label: 'Pending', value: 'Pending' },
                { label: 'Confirmed', value: 'Confirmed' },
                { label: 'Arrived', value: 'Arrived' },
            ],
        },
        { key: 'notes', label: 'Notes', type: 'text' },
    ];
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { children: [_jsx("h2", { className: "text-2xl font-bold text-gray-800 mb-2", children: "Guest Arrivals & Transport" }), _jsx("p", { className: "text-gray-600", children: "Track guest arrivals, transport, and driver assignments" })] }), showAddForm && (_jsxs("div", { className: "bg-white rounded-lg shadow-lg p-6 space-y-4", children: [_jsx("h3", { className: "font-semibold text-gray-800", children: "Add Guest Arrival" }), _jsxs("select", { value: newArrival.guest_id, onChange: (e) => setNewArrival({ ...newArrival, guest_id: e.target.value }), className: "w-full px-3 py-2 border border-gray-300 rounded-lg", children: [_jsx("option", { value: "", children: "Select Guest" }), guests.map((g) => (_jsx("option", { value: g.id, children: g.name }, g.id)))] }), _jsx("input", { type: "date", value: newArrival.arrival_date, onChange: (e) => setNewArrival({ ...newArrival, arrival_date: e.target.value }), className: "w-full px-3 py-2 border border-gray-300 rounded-lg" }), _jsx("input", { type: "time", value: newArrival.arrival_time, onChange: (e) => setNewArrival({ ...newArrival, arrival_time: e.target.value }), className: "w-full px-3 py-2 border border-gray-300 rounded-lg" }), _jsxs("select", { value: newArrival.transport_type, onChange: (e) => setNewArrival({ ...newArrival, transport_type: e.target.value }), className: "w-full px-3 py-2 border border-gray-300 rounded-lg", children: [_jsx("option", { value: "Self", children: "Self" }), _jsx("option", { value: "Train", children: "Train" }), _jsx("option", { value: "Flight", children: "Flight" }), _jsx("option", { value: "Arranged Pickup", children: "Arranged Pickup" })] }), _jsx("input", { type: "text", placeholder: "Driver Name", value: newArrival.driver_assigned, onChange: (e) => setNewArrival({ ...newArrival, driver_assigned: e.target.value }), className: "w-full px-3 py-2 border border-gray-300 rounded-lg" }), _jsx("input", { type: "text", placeholder: "Vehicle Number", value: newArrival.vehicle_number, onChange: (e) => setNewArrival({ ...newArrival, vehicle_number: e.target.value }), className: "w-full px-3 py-2 border border-gray-300 rounded-lg" }), _jsx("textarea", { placeholder: "Notes", value: newArrival.notes, onChange: (e) => setNewArrival({ ...newArrival, notes: e.target.value }), className: "w-full px-3 py-2 border border-gray-300 rounded-lg" }), _jsxs("div", { className: "flex gap-2", children: [_jsx("button", { onClick: handleAdd, className: "px-4 py-2 bg-rose-gold text-white rounded-lg hover:bg-rose-gold/90", children: "Add" }), _jsx("button", { onClick: () => setShowAddForm(false), className: "px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400", children: "Cancel" })] })] })), _jsx(EditableTable, { columns: columns, data: arrivals, onUpdate: handleUpdate, onDelete: handleDelete, onAdd: () => setShowAddForm(true), loading: loading })] }));
}
