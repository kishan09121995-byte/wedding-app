import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Plus, Edit2, Trash2, Save, X } from 'lucide-react';
import { toast } from 'sonner';
const CATEGORIES = ['Photographer', 'Decorator', 'DJ', 'Catering', 'Transport', 'Other'];
export default function VendorTracker() {
    const [vendors, setVendors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [filterCategory, setFilterCategory] = useState(null);
    const [newVendor, setNewVendor] = useState({
        name: '',
        category: 'Photographer',
        contact: '',
        budgeted: 0,
        notes: '',
    });
    const [editData, setEditData] = useState({});
    useEffect(() => {
        const loadVendors = async () => {
            const { data, error } = await supabase.from('vendors').select('*').order('category');
            if (error)
                console.error('Error loading vendors:', error);
            if (data)
                setVendors(data);
            setLoading(false);
        };
        loadVendors();
    }, []);
    const handleAddVendor = async () => {
        if (!newVendor.name.trim()) {
            toast.error('Please enter vendor name');
            return;
        }
        setSaving(true);
        const { data, error } = await supabase
            .from('vendors')
            .insert([{ ...newVendor, paid: 0 }])
            .select();
        if (error) {
            toast.error('Failed to add vendor');
            console.error(error);
        }
        else if (data) {
            setVendors([...vendors, data[0]]);
            setNewVendor({
                name: '',
                category: 'Photographer',
                contact: '',
                budgeted: 0,
                notes: '',
            });
            toast.success('Vendor added');
        }
        setSaving(false);
    };
    const handleEdit = (vendor) => {
        setEditingId(vendor.id);
        setEditData(vendor);
    };
    const handleSaveEdit = async () => {
        if (!editingId)
            return;
        setSaving(true);
        const { error } = await supabase
            .from('vendors')
            .update(editData)
            .eq('id', editingId);
        if (error) {
            toast.error('Failed to update vendor');
            console.error(error);
        }
        else {
            setVendors((prev) => prev.map((v) => (v.id === editingId ? { ...v, ...editData } : v)));
            setEditingId(null);
            setEditData({});
            toast.success('Vendor updated');
        }
        setSaving(false);
    };
    const handleDeleteVendor = async (vendorId) => {
        if (!confirm('Delete this vendor?'))
            return;
        setSaving(true);
        const { error } = await supabase.from('vendors').delete().eq('id', vendorId);
        if (error) {
            toast.error('Failed to delete vendor');
            console.error(error);
        }
        else {
            setVendors((prev) => prev.filter((v) => v.id !== vendorId));
            toast.success('Vendor deleted');
        }
        setSaving(false);
    };
    const displayVendors = filterCategory
        ? vendors.filter((v) => v.category === filterCategory)
        : vendors;
    const totalBudgeted = displayVendors.reduce((sum, v) => sum + v.budgeted, 0);
    const totalPaid = displayVendors.reduce((sum, v) => sum + v.paid, 0);
    const totalBalance = totalBudgeted - totalPaid;
    if (loading)
        return _jsx("div", { className: "p-6", children: "Loading..." });
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-2xl font-bold text-gray-800", children: "Vendor Tracker" }), _jsx("p", { className: "text-gray-600 text-sm mt-1", children: "Manage vendors, contracts, and payment status" })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-4 gap-4", children: [_jsxs("div", { className: "bg-white rounded-lg p-6 shadow-sm border border-gray-200", children: [_jsx("p", { className: "text-gray-600 text-sm font-medium", children: "Total Vendors" }), _jsx("p", { className: "text-3xl font-bold text-gray-800 mt-2", children: vendors.length })] }), _jsxs("div", { className: "bg-white rounded-lg p-6 shadow-sm border border-gray-200", children: [_jsx("p", { className: "text-gray-600 text-sm font-medium", children: "Total Budgeted" }), _jsxs("p", { className: "text-3xl font-bold text-blue-700 mt-2", children: ["\u20B9", totalBudgeted.toLocaleString()] })] }), _jsxs("div", { className: "bg-white rounded-lg p-6 shadow-sm border border-gray-200", children: [_jsx("p", { className: "text-gray-600 text-sm font-medium", children: "Total Paid" }), _jsxs("p", { className: "text-3xl font-bold text-green-700 mt-2", children: ["\u20B9", totalPaid.toLocaleString()] })] }), _jsxs("div", { className: "bg-white rounded-lg p-6 shadow-sm border border-gray-200", children: [_jsx("p", { className: "text-gray-600 text-sm font-medium", children: "Balance Due" }), _jsxs("p", { className: `text-3xl font-bold mt-2 ${totalBalance > 0 ? 'text-red-700' : 'text-green-700'}`, children: ["\u20B9", totalBalance.toLocaleString()] })] })] }), _jsxs("div", { className: "bg-white rounded-lg shadow-sm border border-gray-200 p-6", children: [_jsx("h2", { className: "text-lg font-bold text-gray-800 mb-4", children: "Add New Vendor" }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-6 gap-3", children: [_jsx("input", { type: "text", placeholder: "Vendor name", value: newVendor.name, onChange: (e) => setNewVendor({ ...newVendor, name: e.target.value }), className: "px-3 py-2 border border-gray-300 rounded-lg text-sm" }), _jsx("select", { value: newVendor.category, onChange: (e) => setNewVendor({ ...newVendor, category: e.target.value }), className: "px-3 py-2 border border-gray-300 rounded-lg text-sm", children: CATEGORIES.map((cat) => (_jsx("option", { value: cat, children: cat }, cat))) }), _jsx("input", { type: "text", placeholder: "Contact", value: newVendor.contact, onChange: (e) => setNewVendor({ ...newVendor, contact: e.target.value }), className: "px-3 py-2 border border-gray-300 rounded-lg text-sm" }), _jsx("input", { type: "number", placeholder: "Budgeted (\u20B9)", value: newVendor.budgeted || '', onChange: (e) => setNewVendor({ ...newVendor, budgeted: parseInt(e.target.value, 10) || 0 }), className: "px-3 py-2 border border-gray-300 rounded-lg text-sm" }), _jsx("input", { type: "text", placeholder: "Notes", value: newVendor.notes, onChange: (e) => setNewVendor({ ...newVendor, notes: e.target.value }), className: "px-3 py-2 border border-gray-300 rounded-lg text-sm" }), _jsxs("button", { onClick: handleAddVendor, disabled: saving, className: "flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 text-sm font-medium", children: [_jsx(Plus, { className: "w-4 h-4" }), "Add"] })] })] }), _jsxs("div", { className: "flex gap-2 flex-wrap", children: [_jsx("button", { onClick: () => setFilterCategory(null), className: `px-4 py-2 rounded-lg font-medium transition-colors ${filterCategory === null ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`, children: "All Vendors" }), CATEGORIES.map((cat) => (_jsx("button", { onClick: () => setFilterCategory(cat), className: `px-4 py-2 rounded-lg font-medium transition-colors ${filterCategory === cat ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`, children: cat }, cat)))] }), _jsx("div", { className: "bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden", children: _jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "w-full text-sm", children: [_jsx("thead", { children: _jsxs("tr", { className: "border-b border-gray-200 bg-gray-50", children: [_jsx("th", { className: "px-6 py-3 text-left font-semibold text-gray-700", children: "Name" }), _jsx("th", { className: "px-6 py-3 text-left font-semibold text-gray-700", children: "Category" }), _jsx("th", { className: "px-6 py-3 text-left font-semibold text-gray-700", children: "Contact" }), _jsx("th", { className: "px-6 py-3 text-right font-semibold text-gray-700", children: "Budgeted (\u20B9)" }), _jsx("th", { className: "px-6 py-3 text-right font-semibold text-gray-700", children: "Paid (\u20B9)" }), _jsx("th", { className: "px-6 py-3 text-right font-semibold text-gray-700", children: "Balance (\u20B9)" }), _jsx("th", { className: "px-6 py-3 text-left font-semibold text-gray-700", children: "Notes" }), _jsx("th", { className: "px-6 py-3 text-center font-semibold text-gray-700", children: "Action" })] }) }), _jsx("tbody", { children: displayVendors.map((vendor) => {
                                    const isEditing = editingId === vendor.id;
                                    const current = isEditing ? editData : vendor;
                                    const balance = current.budgeted - current.paid;
                                    return (_jsx("tr", { className: "border-b border-gray-100 hover:bg-gray-50", children: isEditing ? (_jsxs(_Fragment, { children: [_jsx("td", { className: "px-6 py-4", children: _jsx("input", { type: "text", value: current.name, onChange: (e) => setEditData({ ...editData, name: e.target.value }), className: "w-full px-2 py-1 border border-gray-300 rounded text-sm" }) }), _jsx("td", { className: "px-6 py-4", children: _jsx("select", { value: current.category, onChange: (e) => setEditData({ ...editData, category: e.target.value }), className: "w-full px-2 py-1 border border-gray-300 rounded text-sm", children: CATEGORIES.map((cat) => (_jsx("option", { value: cat, children: cat }, cat))) }) }), _jsx("td", { className: "px-6 py-4", children: _jsx("input", { type: "text", value: current.contact, onChange: (e) => setEditData({ ...editData, contact: e.target.value }), className: "w-full px-2 py-1 border border-gray-300 rounded text-sm" }) }), _jsx("td", { className: "px-6 py-4 text-right", children: _jsx("input", { type: "number", value: current.budgeted, onChange: (e) => setEditData({ ...editData, budgeted: parseInt(e.target.value, 10) || 0 }), className: "w-24 px-2 py-1 border border-gray-300 rounded text-right text-sm" }) }), _jsx("td", { className: "px-6 py-4 text-right", children: _jsx("input", { type: "number", value: current.paid, onChange: (e) => setEditData({ ...editData, paid: parseInt(e.target.value, 10) || 0 }), className: "w-24 px-2 py-1 border border-gray-300 rounded text-right text-sm" }) }), _jsxs("td", { className: "px-6 py-4 text-right font-semibold text-gray-800", children: ["\u20B9", balance.toLocaleString()] }), _jsx("td", { className: "px-6 py-4", children: _jsx("input", { type: "text", value: current.notes, onChange: (e) => setEditData({ ...editData, notes: e.target.value }), className: "w-full px-2 py-1 border border-gray-300 rounded text-sm" }) }), _jsxs("td", { className: "px-6 py-4 text-center flex gap-2 justify-center", children: [_jsx("button", { onClick: handleSaveEdit, disabled: saving, className: "p-2 hover:bg-green-100 rounded-lg transition-colors disabled:opacity-50", children: _jsx(Save, { className: "w-4 h-4 text-green-600" }) }), _jsx("button", { onClick: () => {
                                                                setEditingId(null);
                                                                setEditData({});
                                                            }, disabled: saving, className: "p-2 hover:bg-red-100 rounded-lg transition-colors disabled:opacity-50", children: _jsx(X, { className: "w-4 h-4 text-red-600" }) })] })] })) : (_jsxs(_Fragment, { children: [_jsx("td", { className: "px-6 py-4 text-gray-900 font-medium", children: vendor.name }), _jsx("td", { className: "px-6 py-4 text-gray-700", children: vendor.category }), _jsx("td", { className: "px-6 py-4 text-gray-700", children: vendor.contact }), _jsxs("td", { className: "px-6 py-4 text-right text-gray-900", children: ["\u20B9", vendor.budgeted.toLocaleString()] }), _jsxs("td", { className: "px-6 py-4 text-right text-gray-900", children: ["\u20B9", vendor.paid.toLocaleString()] }), _jsxs("td", { className: `px-6 py-4 text-right font-semibold ${balance > 0 ? 'text-red-600' : 'text-green-600'}`, children: ["\u20B9", balance.toLocaleString()] }), _jsx("td", { className: "px-6 py-4 text-gray-700 text-xs", children: vendor.notes }), _jsxs("td", { className: "px-6 py-4 text-center flex gap-2 justify-center", children: [_jsx("button", { onClick: () => handleEdit(vendor), disabled: saving, className: "p-2 hover:bg-blue-100 rounded-lg transition-colors disabled:opacity-50", children: _jsx(Edit2, { className: "w-4 h-4 text-blue-600" }) }), _jsx("button", { onClick: () => handleDeleteVendor(vendor.id), disabled: saving, className: "p-2 hover:bg-red-100 rounded-lg transition-colors disabled:opacity-50", children: _jsx(Trash2, { className: "w-4 h-4 text-red-600" }) })] })] })) }, vendor.id));
                                }) })] }) }) })] }));
}
