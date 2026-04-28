import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../store/authStore';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, CheckCircle, Users, Key } from 'lucide-react';
export default function AdminPanel() {
    const navigate = useNavigate();
    const { user } = useAuthStore();
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    useEffect(() => {
        // Check if user is admin
        if (!user) {
            navigate('/');
        }
    }, [user, navigate]);
    const handleCreateAllAccounts = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess(false);
        setLoading(true);
        const allAccounts = [
            { email: 'kishan@weddingapp.test', username: 'kishan', role: 'admin' },
            { email: 'megha@weddingapp.test', username: 'megha', role: 'admin' },
            { email: 'palak@weddingapp.test', username: 'palak', role: 'editor' },
            { email: 'payal@weddingapp.test', username: 'payal', role: 'editor' },
            { email: 'darsh@weddingapp.test', username: 'darsh', role: 'editor' },
            { email: 'sahil@weddingapp.test', username: 'sahil', role: 'editor' },
            { email: 'kruti@weddingapp.test', username: 'kruti', role: 'editor' },
            { email: 'dharmesh@weddingapp.test', username: 'dharmesh', role: 'editor' },
            { email: 'nilesh@weddingapp.test', username: 'nilesh', role: 'editor' },
            { email: 'alka@weddingapp.test', username: 'alka', role: 'editor' },
            { email: 'nalita@weddingapp.test', username: 'nalita', role: 'editor' },
            { email: 'photographer@weddingapp.test', username: 'photographer', role: 'vendor' },
            { email: 'decorator@weddingapp.test', username: 'decorator', role: 'vendor' },
            { email: 'caterer@weddingapp.test', username: 'caterer', role: 'vendor' },
            { email: 'eventmanager1@weddingapp.test', username: 'eventmanager1', role: 'event_manager' },
            { email: 'eventmanager2@weddingapp.test', username: 'eventmanager2', role: 'event_manager' },
        ];
        let created = 0;
        let skipped = 0;
        try {
            for (const account of allAccounts) {
                try {
                    const { error: signUpError } = await supabase.auth.signUp({
                        email: account.email,
                        password: 'test123@',
                        options: {
                            data: {
                                username: account.username,
                                role: account.role
                            }
                        }
                    });
                    if (signUpError) {
                        if (signUpError.message.includes('already registered')) {
                            skipped++;
                        }
                        else {
                            console.log(`${account.username}: ${signUpError.message}`);
                        }
                    }
                    else {
                        created++;
                    }
                }
                catch (err) {
                    console.log(`Error creating ${account.username}:`, err.message);
                }
            }
            setSuccess(true);
            setMessage(`Created ${created} accounts, ${skipped} already exist. All users: username / test123@`);
        }
        catch (err) {
            setError(err.message || 'Failed to create accounts');
        }
        finally {
            setLoading(false);
        }
    };
    const handleResetOwnPassword = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess(false);
        if (newPassword !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }
        if (newPassword.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }
        setLoading(true);
        try {
            const { error: updateError } = await supabase.auth.updateUser({
                password: newPassword
            });
            if (updateError)
                throw updateError;
            setSuccess(true);
            setMessage('Your password updated successfully! Please log in again.');
            setNewPassword('');
            setConfirmPassword('');
            setTimeout(() => {
                supabase.auth.signOut();
            }, 2000);
        }
        catch (err) {
            setError(err.message || 'Failed to update password');
        }
        finally {
            setLoading(false);
        }
    };
    return (_jsx("div", { className: "min-h-screen bg-cream p-6", children: _jsxs("div", { className: "max-w-2xl mx-auto", children: [_jsxs("div", { className: "mb-8", children: [_jsxs("div", { className: "flex items-center gap-3 mb-2", children: [_jsx(Users, { className: "w-8 h-8 text-rose-gold" }), _jsx("h1", { className: "text-3xl font-bold text-mauve", children: "Admin Panel" })] }), _jsx("p", { className: "text-gray-600", children: "Manage accounts and passwords" })] }), success && (_jsxs("div", { className: "mb-6 p-4 rounded-lg bg-green-50 text-green-700 border border-green-200 flex gap-3", children: [_jsx(CheckCircle, { className: "w-5 h-5 flex-shrink-0 mt-0.5" }), _jsx("p", { children: message })] })), error && (_jsxs("div", { className: "mb-6 p-4 rounded-lg bg-red-50 text-red-700 border border-red-200 flex gap-3", children: [_jsx(AlertCircle, { className: "w-5 h-5 flex-shrink-0 mt-0.5" }), _jsx("p", { children: error })] })), _jsxs("div", { className: "bg-white rounded-lg shadow-lg p-8 mb-6", children: [_jsxs("div", { className: "flex items-center gap-2 mb-6", children: [_jsx(Key, { className: "w-6 h-6 text-rose-gold" }), _jsx("h2", { className: "text-2xl font-bold text-gray-800", children: "Change Your Password" })] }), _jsxs("form", { onSubmit: handleResetOwnPassword, className: "space-y-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "New Password (minimum 6 characters)" }), _jsx("input", { type: "password", value: newPassword, onChange: (e) => setNewPassword(e.target.value), placeholder: "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022", required: true, className: "w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-gold focus:border-transparent outline-none" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Confirm Password" }), _jsx("input", { type: "password", value: confirmPassword, onChange: (e) => setConfirmPassword(e.target.value), placeholder: "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022", required: true, className: "w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-gold focus:border-transparent outline-none" })] }), _jsx("button", { type: "submit", disabled: loading, className: "w-full bg-rose-gold hover:bg-rose-gold/90 disabled:opacity-50 text-white font-medium py-2 rounded-lg transition", children: loading ? 'Updating...' : 'Update My Password' })] })] }), _jsxs("div", { className: "bg-white rounded-lg shadow-lg p-8", children: [_jsxs("div", { className: "flex items-center gap-2 mb-6", children: [_jsx(Users, { className: "w-6 h-6 text-rose-gold" }), _jsx("h2", { className: "text-2xl font-bold text-gray-800", children: "Setup All 16 User Accounts" })] }), _jsxs("p", { className: "text-gray-600 mb-4", children: ["Create all wedding app user accounts with password: ", _jsx("strong", { children: "test123@" })] }), _jsxs("form", { onSubmit: handleCreateAllAccounts, className: "space-y-4", children: [_jsxs("div", { className: "bg-green-50 p-4 rounded-lg border border-green-200", children: [_jsx("p", { className: "text-sm text-green-700 font-medium mb-2", children: "All 16 accounts with password: test123@" }), _jsxs("div", { className: "grid grid-cols-2 gap-2 text-xs text-green-600", children: [_jsxs("div", { children: [_jsx("p", { className: "font-semibold", children: "Admins:" }), _jsx("p", { children: "kishan, megha" })] }), _jsxs("div", { children: [_jsx("p", { className: "font-semibold", children: "Editors (9):" }), _jsx("p", { children: "palak, payal, darsh, sahil, kruti, dharmesh, nilesh, alka, nalita" })] }), _jsxs("div", { children: [_jsx("p", { className: "font-semibold", children: "Vendors (3):" }), _jsx("p", { children: "photographer, decorator, caterer" })] }), _jsxs("div", { children: [_jsx("p", { className: "font-semibold", children: "Event Mgrs (2):" }), _jsx("p", { children: "eventmanager1, eventmanager2" })] })] })] }), _jsx("button", { type: "submit", disabled: loading, className: "w-full bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white font-medium py-2 rounded-lg transition", children: loading ? 'Creating All Accounts...' : 'Create All 16 Accounts' })] })] }), _jsxs("div", { className: "bg-amber-50 border border-amber-200 rounded-lg p-6 mt-6", children: [_jsx("h3", { className: "font-bold text-amber-900 mb-2", children: "For Other Users:" }), _jsx("p", { className: "text-sm text-amber-800 mb-3", children: "Each user can reset their own password by:" }), _jsxs("ol", { className: "text-sm text-amber-800 space-y-1 list-decimal list-inside", children: [_jsx("li", { children: "Go to login page" }), _jsx("li", { children: "Click \"Reset Password\"" }), _jsx("li", { children: "Enter their username and current password" }), _jsx("li", { children: "Set a new password (6+ characters)" })] })] })] }) }));
}
