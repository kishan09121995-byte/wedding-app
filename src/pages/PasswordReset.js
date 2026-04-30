import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { Lock, AlertCircle, CheckCircle } from 'lucide-react';
export default function PasswordReset() {
    const [step, setStep] = useState('login');
    const [email, setEmail] = useState('');
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');
        setLoading(true);
        try {
            const authEmail = email.includes('@') ? email : `${email}@wedding.local`;
            const { error } = await supabase.auth.signInWithPassword({
                email: authEmail,
                password: currentPassword,
            });
            if (error)
                throw error;
            setStep('reset');
            setMessage('Logged in! Now set your new password.');
        }
        catch (err) {
            setError(err.message || 'Login failed');
        }
        finally {
            setLoading(false);
        }
    };
    const handleResetPassword = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess(false);
        if (newPassword !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }
        if (newPassword.length < 6) {
            setError('New password must be at least 6 characters');
            return;
        }
        setLoading(true);
        try {
            const { error } = await supabase.auth.updateUser({
                password: newPassword,
            });
            if (error)
                throw error;
            setSuccess(true);
            setMessage('Password updated successfully! Please log out and log back in.');
            setTimeout(() => {
                supabase.auth.signOut();
            }, 2000);
        }
        catch (err) {
            setError(err.message || 'Password update failed');
        }
        finally {
            setLoading(false);
        }
    };
    return (_jsx("div", { className: "min-h-screen bg-gradient-to-br from-cream via-rose-gold/10 to-mauve/10 flex items-center justify-center p-4", children: _jsxs("div", { className: "w-full max-w-md", children: [_jsxs("div", { className: "text-center mb-8", children: [_jsxs("div", { className: "flex items-center justify-center gap-2 mb-4", children: [_jsx(Lock, { className: "w-8 h-8 text-rose-gold" }), _jsx("h1", { className: "text-3xl font-bold text-mauve", children: "Password Reset" })] }), _jsx("p", { className: "text-gray-600", children: "Update your wedding app password" })] }), _jsx("div", { className: "bg-white rounded-lg shadow-lg p-8", children: step === 'login' ? (_jsxs("form", { onSubmit: handleLogin, className: "space-y-4", children: [_jsx("h2", { className: "text-xl font-bold text-gray-800 mb-6", children: "Verify Your Account" }), message && (_jsxs("div", { className: "mb-4 p-3 rounded-lg bg-green-50 text-green-700 border border-green-200 flex gap-2", children: [_jsx(CheckCircle, { className: "w-5 h-5 flex-shrink-0 mt-0.5" }), _jsx("p", { className: "text-sm", children: message })] })), error && (_jsxs("div", { className: "mb-4 p-3 rounded-lg bg-red-50 text-red-700 border border-red-200 flex gap-2", children: [_jsx(AlertCircle, { className: "w-5 h-5 flex-shrink-0 mt-0.5" }), _jsx("p", { className: "text-sm", children: error })] })), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Username or Email" }), _jsx("input", { type: "text", value: email, onChange: (e) => setEmail(e.target.value), placeholder: "kishan", required: true, className: "w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-gold focus:border-transparent outline-none" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Current Password" }), _jsx("input", { type: "password", value: currentPassword, onChange: (e) => setCurrentPassword(e.target.value), placeholder: "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022", required: true, className: "w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-gold focus:border-transparent outline-none" })] }), _jsx("button", { type: "submit", disabled: loading, className: "w-full bg-rose-gold hover:bg-rose-gold/90 disabled:opacity-50 text-white font-medium py-2 rounded-lg transition", children: loading ? 'Verifying...' : 'Next' })] })) : (_jsxs("form", { onSubmit: handleResetPassword, className: "space-y-4", children: [_jsx("h2", { className: "text-xl font-bold text-gray-800 mb-6", children: "Set New Password" }), message && (_jsxs("div", { className: "mb-4 p-3 rounded-lg bg-green-50 text-green-700 border border-green-200 flex gap-2", children: [_jsx(CheckCircle, { className: "w-5 h-5 flex-shrink-0 mt-0.5" }), _jsx("p", { className: "text-sm", children: message })] })), error && (_jsxs("div", { className: "mb-4 p-3 rounded-lg bg-red-50 text-red-700 border border-red-200 flex gap-2", children: [_jsx(AlertCircle, { className: "w-5 h-5 flex-shrink-0 mt-0.5" }), _jsx("p", { className: "text-sm", children: error })] })), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "New Password (minimum 6 characters)" }), _jsx("input", { type: "password", value: newPassword, onChange: (e) => setNewPassword(e.target.value), placeholder: "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022", required: true, className: "w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-gold focus:border-transparent outline-none" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Confirm Password" }), _jsx("input", { type: "password", value: confirmPassword, onChange: (e) => setConfirmPassword(e.target.value), placeholder: "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022", required: true, className: "w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-gold focus:border-transparent outline-none" })] }), _jsx("button", { type: "submit", disabled: loading || success, className: "w-full bg-rose-gold hover:bg-rose-gold/90 disabled:opacity-50 text-white font-medium py-2 rounded-lg transition", children: loading ? 'Updating...' : 'Update Password' }), _jsx("button", { type: "button", onClick: () => {
                                    setStep('login');
                                    setError('');
                                    setMessage('');
                                }, className: "w-full text-rose-gold hover:text-rose-gold/80 font-medium py-2", children: "Back" })] })) })] }) }));
}
