import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Printer, Clock, CheckCircle2, AlertCircle, Pause } from 'lucide-react';
import { toast } from 'sonner';
const SEED_EVENTS = [
    // Day 1 - 21 Jun
    { time: '09:00', event: 'Mandap Ceremony', venue: 'Kiara Ballroom', coordinator: 'Kishan', catering_action: 'Setup', status: 'Planned' },
    { time: '11:00', event: 'Reception & Lunch', venue: 'Main Dining', coordinator: 'Megha', catering_action: 'Serve', status: 'Planned' },
    { time: '13:30', event: 'Guest Rest Period', venue: 'Rooms', coordinator: 'Manager', catering_action: 'Prepare', status: 'Planned' },
    { time: '16:00', event: 'Haldi Ceremony', venue: 'Terrace', coordinator: 'Mother', catering_action: 'HiTea', status: 'Planned' },
    { time: '18:00', event: 'Carnival & Games', venue: 'Lawn', coordinator: 'Entertainers', catering_action: 'Snacks', status: 'Planned' },
    { time: '20:00', event: 'Sangeet Night', venue: 'Grand Ballroom', coordinator: 'DJ', catering_action: 'Dinner', status: 'Planned' },
    { time: '22:00', event: 'Late Night Snacks', venue: 'Terrace Bar', coordinator: 'Staff', catering_action: 'Serve', status: 'Planned' },
    { time: '23:30', event: 'Guests Retire', venue: 'Rooms', coordinator: 'Manager', catering_action: 'Cleanup', status: 'Planned' },
    // Day 2 - 22 Jun
    { time: '07:00', event: 'Breakfast Service', venue: 'Dining', coordinator: 'Catering', catering_action: 'Breakfast', status: 'Planned' },
    { time: '09:00', event: 'Bridal Preparations', venue: 'Bridal Suite', coordinator: 'Makeup Artist', catering_action: 'Tea', status: 'Planned' },
    { time: '10:30', event: 'Groom Preparations', venue: 'Groom Suite', coordinator: 'Groom', catering_action: 'Tea', status: 'Planned' },
    { time: '12:00', event: 'Baraat Arrival', venue: 'Lawn Gate', coordinator: 'Groom Family', catering_action: 'Welcome', status: 'Planned' },
    { time: '13:00', event: 'Wedding Ceremony', venue: 'Mandap', coordinator: 'Priest', catering_action: 'Standby', status: 'Planned' },
    { time: '15:00', event: 'Wedding Lunch', venue: 'Main Dining', coordinator: 'Catering Head', catering_action: 'Lunch Service', status: 'Planned' },
    { time: '17:00', event: 'Photo Session', venue: 'Lawn & Gardens', coordinator: 'Photographer', catering_action: 'Tea', status: 'Planned' },
    { time: '19:00', event: 'Reception Drinks', venue: 'Lounge', coordinator: 'Bar Manager', catering_action: 'Cocktails', status: 'Planned' },
    { time: '20:00', event: 'Reception Dinner', venue: 'Banquet Hall', coordinator: 'Catering Head', catering_action: 'Dinner', status: 'Planned' },
    { time: '22:30', event: 'Cake Cutting & Dancing', venue: 'Dance Floor', coordinator: 'DJ', catering_action: 'Cake & Drinks', status: 'Planned' },
];
export default function Timeline() {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [day, setDay] = useState('21');
    useEffect(() => {
        const loadEvents = async () => {
            const { data, error } = await supabase
                .from('timeline_events')
                .select('*')
                .order('time');
            if (error) {
                console.error('Error loading events:', error);
                return;
            }
            if (data && data.length === 0) {
                await seedEvents();
            }
            else if (data) {
                setEvents(data);
            }
            setLoading(false);
        };
        const seedEvents = async () => {
            const toInsert = SEED_EVENTS.map((e, i) => ({
                function_id: i < 8 ? 'f2' : 'f4',
                time: e.time,
                event: e.event,
                venue: e.venue,
                coordinator: e.coordinator,
                catering_action: e.catering_action,
                status: e.status,
                notes: '',
            }));
            const { data } = await supabase.from('timeline_events').insert(toInsert).select();
            if (data)
                setEvents(data);
            setLoading(false);
        };
        loadEvents();
    }, []);
    const handleStatusChange = async (eventId, newStatus) => {
        setSaving(true);
        const { error } = await supabase
            .from('timeline_events')
            .update({ status: newStatus })
            .eq('id', eventId);
        if (error) {
            toast.error('Failed to update status');
            console.error(error);
        }
        else {
            setEvents((prev) => prev.map((e) => (e.id === eventId ? { ...e, status: newStatus } : e)));
            toast.success('Status updated');
        }
        setSaving(false);
    };
    const handleNotesChange = async (eventId, newNotes) => {
        const { error } = await supabase
            .from('timeline_events')
            .update({ notes: newNotes })
            .eq('id', eventId);
        if (error)
            console.error('Error updating notes:', error);
    };
    if (loading)
        return _jsx("div", { className: "p-6", children: "Loading..." });
    const day1Events = events.filter((e) => {
        const hour = parseInt(e.time.split(':')[0], 10);
        return hour >= 9 && hour < 24;
    });
    const day2Events = events.filter((e) => {
        const hour = parseInt(e.time.split(':')[0], 10);
        return hour >= 0 && hour < 24;
    }).slice(day1Events.length);
    const displayEvents = day === '21' ? day1Events : day2Events;
    const statusColors = {
        Planned: 'bg-gray-100 text-gray-800 border-gray-200',
        'In Progress': 'bg-blue-100 text-blue-800 border-blue-200',
        Done: 'bg-green-100 text-green-800 border-green-200',
        Cancelled: 'bg-red-100 text-red-800 border-red-200',
    };
    const statusIcons = {
        Planned: _jsx(Clock, { className: "w-4 h-4" }),
        'In Progress': _jsx(Pause, { className: "w-4 h-4" }),
        Done: _jsx(CheckCircle2, { className: "w-4 h-4" }),
        Cancelled: _jsx(AlertCircle, { className: "w-4 h-4" }),
    };
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "flex justify-between items-center", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-2xl font-bold text-gray-800", children: "Wedding Timeline" }), _jsx("p", { className: "text-gray-600 text-sm mt-1", children: "Event schedule, status tracking, and coordination" })] }), _jsxs("button", { onClick: () => window.print(), className: "flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition-colors", children: [_jsx(Printer, { className: "w-4 h-4" }), "Print"] })] }), _jsxs("div", { className: "flex gap-2 border-b border-gray-200", children: [_jsx("button", { onClick: () => setDay('21'), className: `px-6 py-3 font-semibold border-b-2 transition-colors ${day === '21'
                            ? 'border-blue-600 text-blue-600'
                            : 'border-transparent text-gray-600 hover:text-gray-800'}`, children: "Day 1 \u2014 21 Jun 2026" }), _jsx("button", { onClick: () => setDay('22'), className: `px-6 py-3 font-semibold border-b-2 transition-colors ${day === '22'
                            ? 'border-blue-600 text-blue-600'
                            : 'border-transparent text-gray-600 hover:text-gray-800'}`, children: "Day 2 \u2014 22 Jun 2026" })] }), _jsx("div", { className: "bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden", children: _jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "w-full text-sm", children: [_jsx("thead", { children: _jsxs("tr", { className: "border-b border-gray-200 bg-gray-50", children: [_jsx("th", { className: "px-6 py-3 text-left font-semibold text-gray-700", children: "Time" }), _jsx("th", { className: "px-6 py-3 text-left font-semibold text-gray-700", children: "Event" }), _jsx("th", { className: "px-6 py-3 text-left font-semibold text-gray-700", children: "Venue" }), _jsx("th", { className: "px-6 py-3 text-left font-semibold text-gray-700", children: "Coordinator" }), _jsx("th", { className: "px-6 py-3 text-left font-semibold text-gray-700", children: "Catering Action" }), _jsx("th", { className: "px-6 py-3 text-center font-semibold text-gray-700", children: "Status" }), _jsx("th", { className: "px-6 py-3 text-left font-semibold text-gray-700", children: "Notes" })] }) }), _jsx("tbody", { children: displayEvents.map((event) => (_jsxs("tr", { className: "border-b border-gray-100 hover:bg-gray-50", children: [_jsx("td", { className: "px-6 py-4 text-gray-900 font-semibold", children: event.time }), _jsx("td", { className: "px-6 py-4 text-gray-900 font-medium", children: event.event }), _jsx("td", { className: "px-6 py-4 text-gray-700", children: event.venue }), _jsx("td", { className: "px-6 py-4 text-gray-700", children: event.coordinator }), _jsx("td", { className: "px-6 py-4 text-gray-700", children: event.catering_action }), _jsx("td", { className: "px-6 py-4 text-center", children: _jsxs("select", { value: event.status, onChange: (e) => handleStatusChange(event.id, e.target.value), disabled: saving, className: `px-3 py-1 rounded-lg text-xs font-semibold border ${statusColors[event.status] || statusColors.Planned} cursor-pointer disabled:opacity-50`, children: [_jsx("option", { value: "Planned", children: "Planned" }), _jsx("option", { value: "In Progress", children: "In Progress" }), _jsx("option", { value: "Done", children: "Done" }), _jsx("option", { value: "Cancelled", children: "Cancelled" })] }) }), _jsx("td", { className: "px-6 py-4", children: _jsx("input", { type: "text", value: event.notes || '', onChange: (e) => handleNotesChange(event.id, e.target.value), placeholder: "Add notes...", className: "w-32 px-2 py-1 border border-gray-300 rounded text-xs" }) })] }, event.id))) })] }) }) }), _jsx("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-4", children: Object.entries(statusColors).map(([status, colors]) => (_jsx("div", { className: `p-3 rounded-lg border ${colors}`, children: _jsxs("div", { className: "flex items-center gap-2", children: [statusIcons[status], _jsx("span", { className: "text-sm font-medium", children: status })] }) }, status))) })] }));
}
