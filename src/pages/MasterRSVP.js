import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useGuestStore } from '../store/guestStore';
import GuestTable from '../components/GuestTable';
import GuestModal from '../components/GuestModal';
import { Plus, Download, Upload, Search, Filter } from 'lucide-react';
import { Toaster, toast } from 'sonner';
export default function MasterRSVP() {
    const { guests, filters, setGuests, updateGuest, deleteGuest, setFilters, getFilteredGuests, } = useGuestStore();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingGuest, setEditingGuest] = useState();
    const [loading, setLoading] = useState(false);
    // Load guests from Supabase
    useEffect(() => {
        loadGuests();
    }, []);
    const loadGuests = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('guests')
                .select('*')
                .order('name');
            if (error)
                throw error;
            if (data && data.length === 0) {
                // If no guests, seed with sample data
                toast.info('Loading sample data for 294 guests...');
                await seedSampleGuests();
            }
            else {
                setGuests(data || []);
                toast.success(`Loaded ${data?.length || 0} guests`);
            }
        }
        catch (error) {
            console.error('Error loading guests:', error);
            toast.error('Failed to load guests');
        }
        finally {
            setLoading(false);
        }
    };
    const seedSampleGuests = async () => {
        try {
            const { generateSampleGuests } = await import('../lib/seedGuests');
            const sampleGuests = generateSampleGuests();
            // Insert in batches
            const batchSize = 50;
            for (let i = 0; i < sampleGuests.length; i += batchSize) {
                const batch = sampleGuests.slice(i, i + batchSize).map((g) => ({
                    name: g.name,
                    city: g.city,
                    pax_total: g.pax_total,
                    side: g.side,
                    rsvp_status: g.rsvp_status,
                    jain_pax: g.jain_pax,
                    f1: g.f1,
                    f2: g.f2,
                    f3: g.f3,
                    f4: g.f4,
                    room_needed: g.room_needed,
                    hotel_id: g.hotel_id,
                    room_category: g.room_category,
                    check_in: g.check_in,
                    check_out: g.check_out,
                    notes: g.notes,
                    qr_token: Math.random().toString(36).substring(2, 15),
                }));
                const { data, error } = await supabase
                    .from('guests')
                    .insert(batch)
                    .select();
                if (error)
                    throw error;
                if (i === 0)
                    setGuests(data || []);
            }
            const { data } = await supabase.from('guests').select('*').order('name');
            setGuests(data || []);
            toast.success(`✅ Seeded ${sampleGuests.length} sample guests`);
        }
        catch (error) {
            console.error('Error seeding guests:', error);
            toast.error('Failed to seed sample guests');
        }
    };
    const handleAddGuest = () => {
        setEditingGuest(undefined);
        setIsModalOpen(true);
    };
    const handleEditGuest = (guest) => {
        setEditingGuest(guest);
        setIsModalOpen(true);
    };
    const handleSaveGuest = async (formData) => {
        try {
            if (editingGuest) {
                // Update existing
                const { error } = await supabase
                    .from('guests')
                    .update(formData)
                    .eq('id', editingGuest.id);
                if (error)
                    throw error;
                updateGuest(editingGuest.id, formData);
                toast.success('Guest updated');
            }
            else {
                // Add new
                const { data, error } = await supabase
                    .from('guests')
                    .insert({
                    ...formData,
                    qr_token: Math.random().toString(36).substring(2, 15),
                })
                    .select();
                if (error)
                    throw error;
                if (data) {
                    setGuests([...guests, ...data]);
                    toast.success('Guest added');
                }
            }
        }
        catch (error) {
            console.error('Error saving guest:', error);
            toast.error('Failed to save guest');
        }
    };
    const handleDeleteGuest = async (id) => {
        if (!window.confirm('Are you sure you want to delete this guest?'))
            return;
        try {
            const { error } = await supabase.from('guests').delete().eq('id', id);
            if (error)
                throw error;
            deleteGuest(id);
            toast.success('Guest deleted');
        }
        catch (error) {
            console.error('Error deleting guest:', error);
            toast.error('Failed to delete guest');
        }
    };
    const handleUpdateField = async (id, field, value) => {
        try {
            const { error } = await supabase
                .from('guests')
                .update({ [field]: value })
                .eq('id', id);
            if (error)
                throw error;
            updateGuest(id, { [field]: value });
        }
        catch (error) {
            console.error('Error updating field:', error);
            toast.error('Failed to update field');
        }
    };
    const filteredGuests = getFilteredGuests();
    return (_jsxs("div", { className: "space-y-6", children: [_jsx(Toaster, { position: "top-right" }), _jsx("div", { className: "bg-white rounded-lg p-6 shadow-sm border border-gray-200", children: _jsxs("div", { className: "flex flex-col md:flex-row gap-4 items-start md:items-center justify-between", children: [_jsxs("div", { className: "flex-1", children: [_jsx("h3", { className: "text-lg font-bold text-gray-800 mb-3", children: "Master RSVP" }), _jsx("p", { className: "text-sm text-gray-600", children: "294 guests total (161 Groom + 133 Bride)" })] }), _jsxs("div", { className: "flex gap-2 flex-wrap", children: [_jsxs("button", { onClick: handleAddGuest, className: "flex items-center gap-2 bg-rose-gold hover:bg-rose-gold/90 text-white px-4 py-2 rounded-lg transition font-medium", children: [_jsx(Plus, { className: "w-4 h-4" }), "Add Guest"] }), _jsxs("button", { className: "flex items-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg transition font-medium", children: [_jsx(Upload, { className: "w-4 h-4" }), "Import Excel"] }), _jsxs("button", { className: "flex items-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg transition font-medium", children: [_jsx(Download, { className: "w-4 h-4" }), "Export Excel"] })] })] }) }), _jsxs("div", { className: "bg-white rounded-lg p-6 shadow-sm border border-gray-200", children: [_jsxs("div", { className: "flex flex-col md:flex-row gap-4", children: [_jsxs("div", { className: "flex-1", children: [_jsxs("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: [_jsx(Search, { className: "w-4 h-4 inline mr-2" }), "Search by Name or City"] }), _jsx("input", { type: "text", placeholder: "Deepak Mota, Ahmedabad...", value: filters.searchTerm || '', onChange: (e) => setFilters({ ...filters, searchTerm: e.target.value }), className: "w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-gold focus:border-transparent" })] }), _jsxs("div", { children: [_jsxs("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: [_jsx(Filter, { className: "w-4 h-4 inline mr-2" }), "Side"] }), _jsxs("select", { value: filters.side || '', onChange: (e) => setFilters({
                                            ...filters,
                                            side: e.target.value,
                                        }), className: "px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-gold focus:border-transparent", children: [_jsx("option", { value: "", children: "All Sides" }), _jsx("option", { value: "Groom", children: "Groom" }), _jsx("option", { value: "Bride", children: "Bride" })] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "RSVP Status" }), _jsxs("select", { value: filters.rsvp_status || '', onChange: (e) => setFilters({
                                            ...filters,
                                            rsvp_status: e.target.value,
                                        }), className: "px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-gold focus:border-transparent", children: [_jsx("option", { value: "", children: "All Status" }), _jsx("option", { value: "Confirmed", children: "Confirmed" }), _jsx("option", { value: "Not Decided", children: "Not Decided" }), _jsx("option", { value: "Declined", children: "Declined" })] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Hotel" }), _jsxs("select", { value: filters.hotel_id || '', onChange: (e) => setFilters({
                                            ...filters,
                                            hotel_id: e.target.value,
                                        }), className: "px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-gold focus:border-transparent", children: [_jsx("option", { value: "", children: "All Hotels" }), _jsx("option", { value: "leo-resort", children: "LEO Resort" }), _jsx("option", { value: "leo-medium", children: "LEO Medium" }), _jsx("option", { value: "xyz-hotel", children: "XYZ Hotel" }), _jsx("option", { value: "indralok", children: "Indralok" })] })] }), (filters.side || filters.rsvp_status || filters.searchTerm || filters.hotel_id) && (_jsx("div", { className: "flex items-end", children: _jsx("button", { onClick: () => setFilters({}), className: "px-4 py-2 text-rose-gold hover:text-rose-gold/80 font-medium transition", children: "Clear Filters" }) }))] }), _jsxs("p", { className: "text-sm text-gray-600 mt-4", children: ["Showing ", filteredGuests.length, " of ", guests.length, " guests"] })] }), loading ? (_jsx("div", { className: "text-center py-12", children: _jsx("p", { className: "text-gray-600", children: "Loading guests..." }) })) : filteredGuests.length === 0 ? (_jsxs("div", { className: "bg-white rounded-lg p-12 text-center shadow-sm border border-gray-200", children: [_jsx("p", { className: "text-gray-600 mb-4", children: "No guests found" }), _jsx("button", { onClick: handleAddGuest, className: "text-rose-gold hover:text-rose-gold/80 font-medium", children: "Add the first guest \u2192" })] })) : (_jsx(GuestTable, { guests: filteredGuests, onEdit: handleEditGuest, onDelete: handleDeleteGuest, onUpdateField: handleUpdateField })), _jsx(GuestModal, { guest: editingGuest, isOpen: isModalOpen, onClose: () => {
                    setIsModalOpen(false);
                    setEditingGuest(undefined);
                }, onSave: handleSaveGuest })] }));
}
