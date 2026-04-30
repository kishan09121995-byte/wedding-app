import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { EditableTable } from '../components/EditableTable';
import { toast } from 'sonner';
export default function EventDetails() {
    const [details, setDetails] = useState([]);
    const [functions, setFunctions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAddForm, setShowAddForm] = useState(false);
    const [newDetail, setNewDetail] = useState({
        function_id: '',
        detail_type: 'Décor',
        description: '',
        assigned_to: '',
        status: 'Pending',
        photo_url: '',
        notes: '',
    });
    useEffect(() => {
        loadData();
    }, []);
    const loadData = async () => {
        try {
            setLoading(true);
            const [detailRes, funcRes] = await Promise.all([
                supabase.from('event_details').select('*').order('function_id', { ascending: true }),
                supabase.from('functions').select('id, name'),
            ]);
            if (detailRes.error)
                throw detailRes.error;
            if (funcRes.error)
                throw funcRes.error;
            const detailsWithNames = detailRes.data.map((d) => ({
                ...d,
                function_name: funcRes.data.find((f) => f.id === d.function_id)?.name || 'Unknown',
            }));
            setDetails(detailsWithNames);
            setFunctions(funcRes.data || []);
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
                .from('event_details')
                .update({ [field]: value, updated_at: new Date().toISOString() })
                .eq('id', id);
            if (error)
                throw error;
            setDetails((prev) => prev.map((d) => (d.id === id ? { ...d, [field]: value } : d)));
            toast.success('Updated');
        }
        catch (err) {
            toast.error(err.message);
        }
    };
    const handleDelete = async (id) => {
        try {
            const { error } = await supabase.from('event_details').delete().eq('id', id);
            if (error)
                throw error;
            setDetails((prev) => prev.filter((d) => d.id !== id));
            toast.success('Deleted');
        }
        catch (err) {
            toast.error(err.message);
        }
    };
    const handleAdd = async () => {
        try {
            if (!newDetail.function_id) {
                toast.error('Function is required');
                return;
            }
            const { error } = await supabase
                .from('event_details')
                .insert([newDetail]);
            if (error)
                throw error;
            loadData();
            setNewDetail({
                function_id: '',
                detail_type: 'Décor',
                description: '',
                assigned_to: '',
                status: 'Pending',
                photo_url: '',
                notes: '',
            });
            setShowAddForm(false);
            toast.success('Event detail added');
        }
        catch (err) {
            toast.error(err.message);
        }
    };
    const columns = [
        { key: 'function_name', label: 'Function', editable: false },
        {
            key: 'detail_type',
            label: 'Type',
            type: 'select',
            options: [
                { label: 'Décor', value: 'Décor' },
                { label: 'Photography', value: 'Photography' },
                { label: 'Videography', value: 'Videography' },
                { label: 'Lighting', value: 'Lighting' },
                { label: 'Flowers', value: 'Flowers' },
            ],
        },
        { key: 'description', label: 'Description', type: 'text' },
        { key: 'assigned_to', label: 'Assigned To', type: 'text' },
        {
            key: 'status',
            label: 'Status',
            type: 'select',
            options: [
                { label: 'Pending', value: 'Pending' },
                { label: 'In Progress', value: 'In Progress' },
                { label: 'Completed', value: 'Completed' },
            ],
        },
        { key: 'photo_url', label: 'Photo URL', type: 'text' },
        { key: 'notes', label: 'Notes', type: 'text' },
    ];
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { children: [_jsx("h2", { className: "text-2xl font-bold text-gray-800 mb-2", children: "D\u00E9cor & Photography" }), _jsx("p", { className: "text-gray-600", children: "Track d\u00E9cor setup, photography, and videography for each function" })] }), showAddForm && (_jsxs("div", { className: "bg-white rounded-lg shadow-lg p-6 space-y-4", children: [_jsx("h3", { className: "font-semibold text-gray-800", children: "Add Event Detail" }), _jsxs("select", { value: newDetail.function_id, onChange: (e) => setNewDetail({ ...newDetail, function_id: e.target.value }), className: "w-full px-3 py-2 border border-gray-300 rounded-lg", children: [_jsx("option", { value: "", children: "Select Function" }), functions.map((f) => (_jsx("option", { value: f.id, children: f.name }, f.id)))] }), _jsxs("select", { value: newDetail.detail_type, onChange: (e) => setNewDetail({ ...newDetail, detail_type: e.target.value }), className: "w-full px-3 py-2 border border-gray-300 rounded-lg", children: [_jsx("option", { value: "D\u00E9cor", children: "D\u00E9cor" }), _jsx("option", { value: "Photography", children: "Photography" }), _jsx("option", { value: "Videography", children: "Videography" }), _jsx("option", { value: "Lighting", children: "Lighting" }), _jsx("option", { value: "Flowers", children: "Flowers" })] }), _jsx("textarea", { placeholder: "Description", value: newDetail.description, onChange: (e) => setNewDetail({ ...newDetail, description: e.target.value }), className: "w-full px-3 py-2 border border-gray-300 rounded-lg" }), _jsx("input", { type: "text", placeholder: "Assigned To", value: newDetail.assigned_to, onChange: (e) => setNewDetail({ ...newDetail, assigned_to: e.target.value }), className: "w-full px-3 py-2 border border-gray-300 rounded-lg" }), _jsx("input", { type: "url", placeholder: "Photo URL", value: newDetail.photo_url, onChange: (e) => setNewDetail({ ...newDetail, photo_url: e.target.value }), className: "w-full px-3 py-2 border border-gray-300 rounded-lg" }), _jsx("textarea", { placeholder: "Notes", value: newDetail.notes, onChange: (e) => setNewDetail({ ...newDetail, notes: e.target.value }), className: "w-full px-3 py-2 border border-gray-300 rounded-lg" }), _jsxs("div", { className: "flex gap-2", children: [_jsx("button", { onClick: handleAdd, className: "px-4 py-2 bg-rose-gold text-white rounded-lg hover:bg-rose-gold/90", children: "Add" }), _jsx("button", { onClick: () => setShowAddForm(false), className: "px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400", children: "Cancel" })] })] })), _jsx(EditableTable, { columns: columns, data: details, onUpdate: handleUpdate, onDelete: handleDelete, onAdd: () => setShowAddForm(true), loading: loading })] }));
}
