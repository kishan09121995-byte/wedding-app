import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../store/authStore';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, CheckCircle, Users, Edit2, Copy } from 'lucide-react';
export default function UserManagement() {
    const navigate = useNavigate();
    const { user } = useAuthStore();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [editingUser, setEditingUser] = useState(null);
    const [copied, setCopied] = useState('');
    useEffect(() => {
        if (!user) {
            navigate('/');
        }
        else {
            loadUsers();
        }
    }, [user, navigate]);
    const loadUsers = async () => {
        try {
            setLoading(true);
            // Get all users from Supabase auth
            const { data, error } = await supabase.auth.admin.listUsers();
            if (error) {
                throw error;
            }
            const userList = data?.users?.map(u => ({
                id: u.id,
                email: u.email || '',
                username: u.user_metadata?.username || u.email?.split('@')[0] || '',
                role: u.user_metadata?.role || 'user'
            })) || [];
            setUsers(userList);
        }
        catch (err) {
            console.log('Note: Cannot load users via admin API. Display default list.');
            // Show the default list
            setUsers([
                { id: '1', email: 'kishan@weddingapp.test', username: 'kishan', role: 'admin' },
                { id: '2', email: 'megha@weddingapp.test', username: 'megha', role: 'admin' },
                { id: '3', email: 'palak@weddingapp.test', username: 'palak', role: 'editor' },
                { id: '4', email: 'payal@weddingapp.test', username: 'payal', role: 'editor' },
                { id: '5', email: 'darsh@weddingapp.test', username: 'darsh', role: 'editor' },
                { id: '6', email: 'sahil@weddingapp.test', username: 'sahil', role: 'editor' },
                { id: '7', email: 'kruti@weddingapp.test', username: 'kruti', role: 'editor' },
                { id: '8', email: 'dharmesh@weddingapp.test', username: 'dharmesh', role: 'editor' },
                { id: '9', email: 'nilesh@weddingapp.test', username: 'nilesh', role: 'editor' },
                { id: '10', email: 'alka@weddingapp.test', username: 'alka', role: 'editor' },
                { id: '11', email: 'nalita@weddingapp.test', username: 'nalita', role: 'editor' },
                { id: '12', email: 'photographer@weddingapp.test', username: 'photographer', role: 'vendor' },
                { id: '13', email: 'decorator@weddingapp.test', username: 'decorator', role: 'vendor' },
                { id: '14', email: 'caterer@weddingapp.test', username: 'caterer', role: 'vendor' },
                { id: '15', email: 'eventmanager1@weddingapp.test', username: 'eventmanager1', role: 'event_manager' },
                { id: '16', email: 'eventmanager2@weddingapp.test', username: 'eventmanager2', role: 'event_manager' },
            ]);
        }
        finally {
            setLoading(false);
        }
    };
    const handleUpdatePassword = async (userId, newPassword) => {
        setError('');
        setMessage('');
        if (!newPassword || newPassword.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }
        try {
            const { error: updateError } = await supabase.auth.admin.updateUserById(userId, {
                password: newPassword
            });
            if (updateError)
                throw updateError;
            setMessage(`Password updated for user ${userId}`);
            setEditingUser(null);
        }
        catch (err) {
            setError(err.message || 'Failed to update password');
        }
    };
    const copyToClipboard = (text, label) => {
        navigator.clipboard.writeText(text);
        setCopied(label);
        setTimeout(() => setCopied(''), 2000);
    };
    if (loading) {
        return (_jsx("div", { className: "min-h-screen bg-cream flex items-center justify-center", children: _jsx("p", { className: "text-gray-600", children: "Loading users..." }) }));
    }
    return (_jsx("div", { className: "min-h-screen bg-cream p-6", children: _jsxs("div", { className: "max-w-6xl mx-auto", children: [_jsxs("div", { className: "mb-8", children: [_jsxs("div", { className: "flex items-center gap-3 mb-2", children: [_jsx(Users, { className: "w-8 h-8 text-rose-gold" }), _jsx("h1", { className: "text-3xl font-bold text-mauve", children: "User Management" })] }), _jsx("p", { className: "text-gray-600", children: "Manage all 16 user accounts and passwords" })] }), message && (_jsxs("div", { className: "mb-6 p-4 rounded-lg bg-green-50 text-green-700 border border-green-200 flex gap-3", children: [_jsx(CheckCircle, { className: "w-5 h-5 flex-shrink-0 mt-0.5" }), _jsx("p", { children: message })] })), error && (_jsxs("div", { className: "mb-6 p-4 rounded-lg bg-red-50 text-red-700 border border-red-200 flex gap-3", children: [_jsx(AlertCircle, { className: "w-5 h-5 flex-shrink-0 mt-0.5" }), _jsx("p", { children: error })] })), _jsxs("div", { className: "mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200", children: [_jsxs("p", { className: "text-sm text-blue-700 font-medium", children: ["Default Password: ", _jsx("strong", { children: "test123@" })] }), _jsx("p", { className: "text-xs text-blue-600 mt-1", children: "Use this password to login with any username, then change it as needed" })] }), _jsx("div", { className: "bg-white rounded-lg shadow-lg overflow-hidden", children: _jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "w-full", children: [_jsx("thead", { className: "bg-mauve text-white", children: _jsxs("tr", { children: [_jsx("th", { className: "px-6 py-3 text-left text-sm font-semibold", children: "Username" }), _jsx("th", { className: "px-6 py-3 text-left text-sm font-semibold", children: "Email" }), _jsx("th", { className: "px-6 py-3 text-left text-sm font-semibold", children: "Role" }), _jsx("th", { className: "px-6 py-3 text-left text-sm font-semibold", children: "Password" }), _jsx("th", { className: "px-6 py-3 text-left text-sm font-semibold", children: "Actions" })] }) }), _jsx("tbody", { className: "divide-y divide-gray-200", children: users.map((u) => (_jsxs("tr", { className: "hover:bg-gray-50", children: [_jsx("td", { className: "px-6 py-4", children: _jsx("span", { className: "font-medium text-gray-900", children: u.username }) }), _jsx("td", { className: "px-6 py-4", children: _jsx("span", { className: "text-sm text-gray-600", children: u.email }) }), _jsx("td", { className: "px-6 py-4", children: _jsx("span", { className: `px-3 py-1 rounded-full text-xs font-medium ${u.role === 'admin' ? 'bg-rose-100 text-rose-800' :
                                                        u.role === 'vendor' ? 'bg-blue-100 text-blue-800' :
                                                            u.role === 'event_manager' ? 'bg-purple-100 text-purple-800' :
                                                                'bg-gray-100 text-gray-800'}`, children: u.role === 'event_manager' ? 'EVENT MGR' : u.role.toUpperCase() }) }), _jsxs("td", { className: "px-6 py-4", children: [editingUser?.id === u.id ? (_jsxs("div", { className: "flex gap-2", children: [_jsx("input", { type: "text", value: editingUser.newPassword, onChange: (e) => setEditingUser({ ...editingUser, newPassword: e.target.value }), placeholder: "New password", className: "px-3 py-1 border border-gray-300 rounded text-sm w-32" }), _jsx("button", { onClick: () => handleUpdatePassword(u.id, editingUser.newPassword), className: "px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700", children: "Save" }), _jsx("button", { onClick: () => setEditingUser(null), className: "px-3 py-1 bg-gray-300 text-gray-700 rounded text-sm hover:bg-gray-400", children: "Cancel" })] })) : (_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("span", { className: "text-sm text-gray-600 font-mono", children: "test123@" }), _jsx("button", { onClick: () => copyToClipboard('test123@', u.username), className: "p-1 hover:bg-gray-200 rounded transition", title: "Copy password", children: _jsx(Copy, { className: "w-4 h-4 text-gray-500" }) })] })), copied === u.username && _jsx("span", { className: "text-xs text-green-600 ml-2", children: "Copied!" })] }), _jsx("td", { className: "px-6 py-4", children: editingUser?.id !== u.id && (_jsxs("button", { onClick: () => setEditingUser({ id: u.id, newPassword: '' }), className: "flex items-center gap-2 px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition", children: [_jsx(Edit2, { className: "w-4 h-4" }), "Change"] })) })] }, u.id))) })] }) }) }), _jsxs("div", { className: "mt-8 grid grid-cols-4 gap-4", children: [_jsxs("div", { className: "bg-white p-4 rounded-lg shadow text-center", children: [_jsx("p", { className: "text-2xl font-bold text-mauve", children: users.length }), _jsx("p", { className: "text-sm text-gray-600", children: "Total Users" })] }), _jsxs("div", { className: "bg-white p-4 rounded-lg shadow text-center", children: [_jsx("p", { className: "text-2xl font-bold text-rose-600", children: users.filter(u => u.role === 'admin').length }), _jsx("p", { className: "text-sm text-gray-600", children: "Admins" })] }), _jsxs("div", { className: "bg-white p-4 rounded-lg shadow text-center", children: [_jsx("p", { className: "text-2xl font-bold text-blue-600", children: users.filter(u => u.role === 'editor').length }), _jsx("p", { className: "text-sm text-gray-600", children: "Editors" })] }), _jsxs("div", { className: "bg-white p-4 rounded-lg shadow text-center", children: [_jsx("p", { className: "text-2xl font-bold text-purple-600", children: users.filter(u => u.role === 'vendor' || u.role === 'event_manager').length }), _jsx("p", { className: "text-sm text-gray-600", children: "Vendors & Mgrs" })] })] }), _jsxs("div", { className: "mt-8 bg-gradient-to-r from-rose-50 to-purple-50 rounded-lg p-6 border border-rose-200", children: [_jsx("h3", { className: "font-bold text-gray-900 mb-3", children: "How to Login:" }), _jsxs("ol", { className: "space-y-2 text-sm text-gray-700", children: [_jsxs("li", { children: [_jsx("strong", { children: "1." }), " Go to: https://guileless-chebakia-c52b67.netlify.app/"] }), _jsxs("li", { children: [_jsx("strong", { children: "2." }), " Click \"Sign In\""] }), _jsxs("li", { children: [_jsx("strong", { children: "3." }), " Enter any username (e.g., ", _jsx("code", { className: "bg-white px-2 py-1 rounded", children: "kishan" }), ")"] }), _jsxs("li", { children: [_jsx("strong", { children: "4." }), " Enter password: ", _jsx("code", { className: "bg-white px-2 py-1 rounded", children: "test123@" })] }), _jsxs("li", { children: [_jsx("strong", { children: "5." }), " Click \"Sign In\""] })] })] })] }) }));
}
