import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../store/authStore';
import { useNavigate } from 'react-router-dom';
import { Trash2, Plus, CheckCircle, AlertCircle, FileText } from 'lucide-react';
import { toast, Toaster } from 'sonner';
export default function MenuManagement() {
    const navigate = useNavigate();
    const { user } = useAuthStore();
    const [menus, setMenus] = useState([]);
    const [functions, setFunctions] = useState([]);
    const [selectedFunction, setSelectedFunction] = useState(1);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [showAddMenu, setShowAddMenu] = useState(false);
    const [menuCategory, setMenuCategory] = useState('Silver');
    const [menuItems, setMenuItems] = useState('');
    const [quantity, setQuantity] = useState(1);
    const categories = ['Silver', 'Gold', 'Platinum', 'Diamond'];
    useEffect(() => {
        if (!user) {
            navigate('/');
        }
        else {
            loadData();
        }
    }, [user, navigate]);
    const loadData = async () => {
        setLoading(true);
        try {
            // Load functions
            const { data: functionsData } = await supabase
                .from('functions')
                .select('*')
                .order('id');
            // Load menus
            const { data: menusData } = await supabase
                .from('menus')
                .select('*')
                .order('function_id, category');
            setFunctions(functionsData || []);
            setMenus(menusData || []);
        }
        catch (error) {
            console.error('Error loading data:', error);
            toast.error('Failed to load menu data');
        }
        finally {
            setLoading(false);
        }
    };
    const handleAddMenu = async () => {
        if (!menuItems.trim()) {
            toast.error('Please enter menu items');
            return;
        }
        try {
            setUploading(true);
            const items = menuItems.split('\n').filter(item => item.trim()).map(item => ({
                name: item.trim(),
                category: menuCategory,
                price: 0
            }));
            const newMenu = {
                function_id: selectedFunction,
                category: menuCategory,
                items: items,
                quantity: quantity,
                approved: false
            };
            const { error } = await supabase
                .from('menus')
                .insert([newMenu]);
            if (error)
                throw error;
            toast.success(`Added ${items.length} items to ${menuCategory} menu`);
            setMenuItems('');
            setQuantity(1);
            setShowAddMenu(false);
            loadData();
        }
        catch (error) {
            console.error('Error adding menu:', error);
            toast.error('Failed to add menu items');
        }
        finally {
            setUploading(false);
        }
    };
    const handleDeleteMenu = async (menuId) => {
        if (!window.confirm('Delete this menu?'))
            return;
        try {
            const { error } = await supabase
                .from('menus')
                .delete()
                .eq('id', menuId);
            if (error)
                throw error;
            toast.success('Menu deleted');
            loadData();
        }
        catch (error) {
            console.error('Error deleting menu:', error);
            toast.error('Failed to delete menu');
        }
    };
    const handleApprove = async (menuId) => {
        try {
            const { error } = await supabase
                .from('menus')
                .update({ approved: true })
                .eq('id', menuId);
            if (error)
                throw error;
            toast.success('Menu approved');
            loadData();
        }
        catch (error) {
            console.error('Error approving menu:', error);
            toast.error('Failed to approve menu');
        }
    };
    const functionMenus = menus.filter(m => m.function_id === selectedFunction);
    const currentFunction = functions.find(f => f.id === selectedFunction);
    if (loading) {
        return (_jsx("div", { className: "min-h-screen bg-cream flex items-center justify-center", children: _jsx("p", { className: "text-gray-600", children: "Loading menus..." }) }));
    }
    return (_jsxs("div", { className: "space-y-6", children: [_jsx(Toaster, { position: "top-right" }), _jsxs("div", { className: "bg-white rounded-lg p-6 shadow-sm border border-gray-200", children: [_jsxs("div", { className: "flex items-center gap-3 mb-4", children: [_jsx(FileText, { className: "w-8 h-8 text-rose-gold" }), _jsx("h1", { className: "text-3xl font-bold text-mauve", children: "Menu Management" })] }), _jsx("p", { className: "text-gray-600", children: "Manage wedding menu items by function and category" })] }), _jsxs("div", { className: "bg-white rounded-lg p-6 shadow-sm border border-gray-200", children: [_jsx("h2", { className: "text-lg font-semibold text-gray-800 mb-4", children: "Select Function" }), _jsx("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-3", children: functions.map((func) => (_jsx("button", { onClick: () => setSelectedFunction(func.id), className: `p-4 rounded-lg font-medium transition ${selectedFunction === func.id
                                ? 'bg-rose-gold text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`, children: func.name || `Function ${func.id}` }, func.id))) })] }), _jsxs("button", { onClick: () => setShowAddMenu(!showAddMenu), className: "bg-rose-gold hover:bg-rose-gold/90 text-white font-medium py-3 px-6 rounded-lg flex items-center gap-2 transition", children: [_jsx(Plus, { className: "w-5 h-5" }), "Add Menu Items"] }), showAddMenu && (_jsxs("div", { className: "bg-white rounded-lg p-6 shadow-sm border border-gray-200 space-y-4", children: [_jsx("h3", { className: "text-lg font-semibold text-gray-800", children: "Add Menu Items" }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Category" }), _jsx("select", { value: menuCategory, onChange: (e) => setMenuCategory(e.target.value), className: "w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-gold outline-none", children: categories.map((cat) => (_jsx("option", { value: cat, children: cat }, cat))) })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Menu Items (one per line)" }), _jsx("textarea", { value: menuItems, onChange: (e) => setMenuItems(e.target.value), placeholder: "e.g.\nPaneer Tikka\nTandoori Chicken\nVegetable Biryani", className: "w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-gold outline-none", rows: 6 })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Number of Items to Select" }), _jsx("input", { type: "number", value: quantity, onChange: (e) => setQuantity(parseInt(e.target.value) || 1), min: 1, max: 20, className: "w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-gold outline-none" })] }), _jsxs("div", { className: "flex gap-3", children: [_jsx("button", { onClick: handleAddMenu, disabled: uploading, className: "bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-6 rounded-lg transition disabled:opacity-50", children: uploading ? 'Adding...' : 'Add Items' }), _jsx("button", { onClick: () => setShowAddMenu(false), className: "bg-gray-300 hover:bg-gray-400 text-gray-700 font-medium py-2 px-6 rounded-lg transition", children: "Cancel" })] })] })), _jsxs("div", { className: "bg-white rounded-lg p-6 shadow-sm border border-gray-200", children: [_jsxs("h2", { className: "text-lg font-semibold text-gray-800 mb-4", children: [currentFunction?.name || 'Function', " Menus"] }), functionMenus.length === 0 ? (_jsx("p", { className: "text-gray-600 text-center py-8", children: "No menus added yet" })) : (_jsx("div", { className: "space-y-4", children: functionMenus.map((menu) => (_jsxs("div", { className: "border border-gray-200 rounded-lg p-4 space-y-3", children: [_jsxs("div", { className: "flex items-start justify-between", children: [_jsxs("div", { children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsxs("h3", { className: "text-lg font-semibold text-gray-800", children: [menu.category, " Menu"] }), menu.approved ? (_jsxs("span", { className: "flex items-center gap-1 text-green-600 text-sm font-medium", children: [_jsx(CheckCircle, { className: "w-4 h-4" }), "Approved"] })) : (_jsxs("span", { className: "flex items-center gap-1 text-amber-600 text-sm font-medium", children: [_jsx(AlertCircle, { className: "w-4 h-4" }), "Pending"] }))] }), _jsxs("p", { className: "text-sm text-gray-600", children: [menu.items?.length || 0, " items \u2022 Select ", menu.quantity, " items"] })] }), _jsxs("div", { className: "flex gap-2", children: [!menu.approved && (_jsx("button", { onClick: () => menu.id && handleApprove(menu.id), className: "bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm transition", children: "Approve" })), _jsxs("button", { onClick: () => menu.id && handleDeleteMenu(menu.id), className: "bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm transition flex items-center gap-2", children: [_jsx(Trash2, { className: "w-4 h-4" }), "Delete"] })] })] }), menu.items && menu.items.length > 0 && (_jsxs("div", { className: "bg-gray-50 p-3 rounded-lg", children: [_jsx("p", { className: "text-sm font-medium text-gray-700 mb-2", children: "Items:" }), _jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-2", children: menu.items.map((item, idx) => (_jsxs("div", { className: "text-sm text-gray-700 flex items-center gap-2", children: [_jsx("span", { className: "w-2 h-2 bg-rose-gold rounded-full" }), item.name] }, idx))) })] }))] }, menu.id))) }))] }), _jsxs("div", { className: "bg-white rounded-lg p-6 shadow-sm border border-gray-200", children: [_jsx("h2", { className: "text-lg font-semibold text-gray-800 mb-4", children: "Category Summary" }), _jsx("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-4", children: categories.map((category) => {
                            const categoryMenus = functionMenus.filter(m => m.category === category);
                            const totalItems = categoryMenus.reduce((sum, m) => sum + (m.items?.length || 0), 0);
                            return (_jsxs("div", { className: "bg-gray-50 p-4 rounded-lg border border-gray-200", children: [_jsx("p", { className: "text-sm font-medium text-gray-600", children: category }), _jsx("p", { className: "text-2xl font-bold text-rose-gold", children: categoryMenus.length }), _jsxs("p", { className: "text-xs text-gray-500", children: [totalItems, " items"] })] }, category));
                        }) })] })] }));
}
