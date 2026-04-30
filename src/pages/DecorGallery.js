import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Palette, Download, Trash2, Plus } from 'lucide-react';
import { toast } from 'sonner';
export default function DecorGallery() {
    const [decor, setDecor] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterCategory, setFilterCategory] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        category: 'Floral',
        image_url: '',
        location: '',
        estimated_cost: 0,
        notes: ''
    });
    const categories = ['Floral', 'Lighting', 'Seating', 'Entry/Exit', 'Stage', 'Miscellaneous'];
    useEffect(() => {
        loadDecor();
    }, []);
    const loadDecor = async () => {
        try {
            const { data, error } = await supabase
                .from('decor_gallery')
                .select('*')
                .order('created_at', { ascending: false });
            if (error)
                throw error;
            setDecor(data || []);
        }
        catch (error) {
            console.error('Error loading decor:', error);
            toast.error('Failed to load decor gallery');
        }
        finally {
            setLoading(false);
        }
    };
    const handleAddDecor = async () => {
        if (!formData.title.trim() || !formData.image_url.trim()) {
            toast.error('Fill required fields');
            return;
        }
        try {
            const { data, error } = await supabase
                .from('decor_gallery')
                .insert([formData])
                .select();
            if (error)
                throw error;
            setDecor([...(data || []), ...decor]);
            setFormData({ title: '', category: 'Floral', image_url: '', location: '', estimated_cost: 0, notes: '' });
            setShowForm(false);
            toast.success('✅ Decor item added');
        }
        catch (error) {
            console.error('Error adding decor:', error);
            toast.error('Failed to add decor');
        }
    };
    const handleDelete = async (id) => {
        if (!window.confirm('Delete this decor item?'))
            return;
        try {
            const { error } = await supabase
                .from('decor_gallery')
                .delete()
                .eq('id', id);
            if (error)
                throw error;
            setDecor(decor.filter(d => d.id !== id));
            toast.success('Decor deleted');
        }
        catch (error) {
            console.error('Error deleting:', error);
            toast.error('Failed to delete');
        }
    };
    const filteredDecor = decor.filter(d => {
        const matchesSearch = d.title.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = !filterCategory || d.category === filterCategory;
        return matchesSearch && matchesCategory;
    });
    const totalCost = filteredDecor.reduce((sum, d) => sum + d.estimated_cost, 0);
    if (loading) {
        return _jsx("div", { className: "flex items-center justify-center h-screen", children: _jsx("p", { children: "Loading decor gallery..." }) });
    }
    return (_jsxs("div", { className: "space-y-6", children: [_jsx("div", { className: "bg-white rounded-lg p-6 shadow-sm border border-gray-200", children: _jsxs("div", { className: "flex justify-between items-center", children: [_jsxs("div", { children: [_jsxs("h1", { className: "text-3xl font-bold text-gray-800 flex items-center gap-2", children: [_jsx(Palette, { className: "w-8 h-8 text-rose-gold" }), "D\u00E9cor Reference Gallery"] }), _jsx("p", { className: "text-gray-600 mt-2", children: "Showcase decor options and ideas" })] }), _jsxs("button", { onClick: () => setShowForm(!showForm), className: "bg-rose-gold hover:bg-rose-gold/90 text-white font-semibold px-6 py-3 rounded-lg transition flex items-center gap-2", children: [_jsx(Plus, { className: "w-5 h-5" }), "Add Decor"] })] }) }), showForm && (_jsxs("div", { className: "bg-white rounded-lg p-6 shadow-sm border border-gray-200 space-y-4", children: [_jsx("h2", { className: "text-lg font-bold text-gray-800", children: "Add D\u00E9cor Item" }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Title *" }), _jsx("input", { type: "text", value: formData.title, onChange: (e) => setFormData({ ...formData, title: e.target.value }), placeholder: "e.g., Crystal Chandelier", className: "w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-gold outline-none" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Category" }), _jsx("select", { value: formData.category, onChange: (e) => setFormData({ ...formData, category: e.target.value }), className: "w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-gold outline-none", children: categories.map(cat => (_jsx("option", { value: cat, children: cat }, cat))) })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Image URL *" }), _jsx("input", { type: "text", value: formData.image_url, onChange: (e) => setFormData({ ...formData, image_url: e.target.value }), placeholder: "https://...", className: "w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-gold outline-none" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Location" }), _jsx("input", { type: "text", value: formData.location, onChange: (e) => setFormData({ ...formData, location: e.target.value }), placeholder: "e.g., Main Hall", className: "w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-gold outline-none" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Estimated Cost (\u20B9)" }), _jsx("input", { type: "number", value: formData.estimated_cost, onChange: (e) => setFormData({ ...formData, estimated_cost: parseInt(e.target.value) || 0 }), className: "w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-gold outline-none" })] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Notes" }), _jsx("textarea", { value: formData.notes, onChange: (e) => setFormData({ ...formData, notes: e.target.value }), rows: 3, className: "w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-gold outline-none" })] }), _jsxs("div", { className: "flex gap-3", children: [_jsx("button", { onClick: handleAddDecor, className: "bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-2 rounded-lg transition", children: "Add" }), _jsx("button", { onClick: () => setShowForm(false), className: "bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold px-6 py-2 rounded-lg transition", children: "Cancel" })] })] })), _jsxs("div", { className: "bg-white rounded-lg p-6 shadow-sm border border-gray-200 space-y-4", children: [_jsxs("div", { className: "flex gap-3", children: [_jsx("div", { className: "flex-1", children: _jsx("input", { type: "text", value: searchTerm, onChange: (e) => setSearchTerm(e.target.value), placeholder: "Search decor...", className: "w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-gold outline-none" }) }), _jsxs("select", { value: filterCategory || '', onChange: (e) => setFilterCategory(e.target.value || null), className: "px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-gold outline-none", children: [_jsx("option", { value: "", children: "All Categories" }), categories.map(cat => (_jsx("option", { value: cat, children: cat }, cat)))] })] }), _jsxs("div", { className: "text-sm text-gray-600", children: ["Showing ", filteredDecor.length, " items \u2022 Total estimated cost: \u20B9", totalCost.toLocaleString()] })] }), _jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6", children: filteredDecor.map(item => (_jsxs("div", { className: "bg-white rounded-lg overflow-hidden shadow-sm border border-gray-200 hover:shadow-lg transition", children: [_jsx("div", { className: "relative aspect-video bg-gray-100 overflow-hidden group", children: _jsx("img", { src: item.image_url, alt: item.title, className: "w-full h-full object-cover group-hover:scale-105 transition-transform", onError: (e) => {
                                    e.currentTarget.src = 'https://via.placeholder.com/300?text=Image+Not+Found';
                                } }) }), _jsxs("div", { className: "p-4 space-y-3", children: [_jsxs("div", { children: [_jsx("h3", { className: "text-lg font-bold text-gray-800", children: item.title }), _jsxs("div", { className: "flex items-center gap-2 mt-1", children: [_jsx("span", { className: "text-xs bg-rose-100 text-rose-700 px-2 py-1 rounded", children: item.category }), item.location && (_jsx("span", { className: "text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded", children: item.location }))] })] }), item.estimated_cost > 0 && (_jsxs("p", { className: "text-lg font-bold text-green-700", children: ["\u20B9", item.estimated_cost.toLocaleString()] })), item.notes && (_jsx("p", { className: "text-sm text-gray-600", children: item.notes })), _jsxs("div", { className: "flex gap-2 pt-3 border-t border-gray-200", children: [_jsxs("a", { href: item.image_url, target: "_blank", rel: "noreferrer", className: "flex-1 flex items-center justify-center gap-1 bg-blue-100 hover:bg-blue-200 text-blue-700 px-3 py-2 rounded text-sm transition", children: [_jsx(Download, { className: "w-4 h-4" }), "View"] }), _jsx("button", { onClick: () => handleDelete(item.id), className: "flex items-center justify-center gap-1 bg-red-100 hover:bg-red-200 text-red-700 px-3 py-2 rounded text-sm transition", children: _jsx(Trash2, { className: "w-4 h-4" }) })] })] })] }, item.id))) })] }));
}
