import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { AlertCircle, CheckCircle, Settings } from 'lucide-react';
export default function SetupWizard() {
    const [password, setPassword] = useState('test123@');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [progress, setProgress] = useState('');
    const allUsers = [
        { username: 'kishan', role: 'admin' },
        { username: 'megha', role: 'admin' },
        { username: 'palak', role: 'editor' },
        { username: 'payal', role: 'editor' },
        { username: 'darsh', role: 'editor' },
        { username: 'sahil', role: 'editor' },
        { username: 'kruti', role: 'editor' },
        { username: 'dharmesh', role: 'editor' },
        { username: 'nilesh', role: 'editor' },
        { username: 'alka', role: 'editor' },
        { username: 'nalita', role: 'editor' },
        { username: 'photographer', role: 'vendor' },
        { username: 'decorator', role: 'vendor' },
        { username: 'caterer', role: 'vendor' },
        { username: 'eventmanager1', role: 'event_manager' },
        { username: 'eventmanager2', role: 'event_manager' },
    ];
    const handleCreateAllAccounts = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess(false);
        setLoading(true);
        setProgress('');
        let created = 0;
        let failed = 0;
        for (let i = 0; i < allUsers.length; i++) {
            const user = allUsers[i];
            const email = `${user.username}@weddingapp.test`;
            try {
                setProgress(`Creating ${user.username}... (${i + 1}/${allUsers.length})`);
                const { error: signUpError } = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        data: {
                            username: user.username,
                            role: user.role
                        }
                    }
                });
                if (signUpError) {
                    if (signUpError.message.includes('already registered')) {
                        setProgress(`Skipping ${user.username} (already exists) (${i + 1}/${allUsers.length})`);
                    }
                    else {
                        console.log(`Failed ${user.username}:`, signUpError.message);
                        failed++;
                    }
                }
                else {
                    created++;
                }
                // Wait 1 second between signups to avoid rate limits
                if (i < allUsers.length - 1) {
                    await new Promise(resolve => setTimeout(resolve, 1000));
                }
            }
            catch (err) {
                console.log(`Error ${user.username}:`, err);
                failed++;
            }
        }
        setProgress('');
        setSuccess(true);
        setError(`Created ${created} accounts. Password for all: ${password}`);
        setLoading(false);
    };
    return (_jsx("div", { className: "min-h-screen bg-gradient-to-br from-cream via-rose-gold/10 to-mauve/10 flex items-center justify-center p-4", children: _jsxs("div", { className: "w-full max-w-2xl", children: [_jsxs("div", { className: "text-center mb-8", children: [_jsxs("div", { className: "flex items-center justify-center gap-2 mb-4", children: [_jsx(Settings, { className: "w-8 h-8 text-rose-gold" }), _jsx("h1", { className: "text-3xl font-bold text-mauve", children: "Wedding App Setup" })] }), _jsx("p", { className: "text-gray-600", children: "Create all 16 user accounts at once" })] }), _jsxs("div", { className: "bg-white rounded-lg shadow-lg p-8", children: [error && (_jsxs("div", { className: `mb-6 p-4 rounded-lg flex gap-3 ${success
                                ? 'bg-green-50 text-green-700 border border-green-200'
                                : 'bg-red-50 text-red-700 border border-red-200'}`, children: [success ? (_jsx(CheckCircle, { className: "w-5 h-5 flex-shrink-0 mt-0.5" })) : (_jsx(AlertCircle, { className: "w-5 h-5 flex-shrink-0 mt-0.5" })), _jsx("p", { className: "text-sm", children: error })] })), progress && (_jsx("div", { className: "mb-6 p-4 rounded-lg bg-blue-50 text-blue-700 border border-blue-200", children: _jsx("p", { className: "text-sm font-medium", children: progress }) })), _jsxs("form", { onSubmit: handleCreateAllAccounts, className: "space-y-6", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Password for All Accounts" }), _jsx("input", { type: "text", value: password, onChange: (e) => setPassword(e.target.value), placeholder: "test123@", required: true, className: "w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-gold focus:border-transparent outline-none" }), _jsx("p", { className: "text-xs text-gray-500 mt-1", children: "Must be at least 6 characters" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-3", children: "Users to Create (16 total)" }), _jsx("div", { className: "grid grid-cols-2 gap-2 p-4 bg-gray-50 rounded-lg", children: allUsers.map((user) => (_jsxs("div", { className: "text-sm text-gray-700", children: [_jsx("span", { className: "font-medium", children: user.username }), _jsxs("span", { className: "text-gray-500 ml-2", children: ["(", user.role === 'event_manager' ? 'EVENT MGR' : user.role.toUpperCase(), ")"] })] }, user.username))) })] }), _jsxs("div", { className: "p-4 bg-blue-50 rounded-lg border border-blue-200", children: [_jsx("p", { className: "text-sm text-blue-700 font-medium mb-2", children: "How it works:" }), _jsxs("ul", { className: "text-sm text-blue-600 space-y-1", children: [_jsx("li", { children: "\u2022 Creates accounts with format: username@weddingapp.test" }), _jsx("li", { children: "\u2022 All accounts get the same password" }), _jsx("li", { children: "\u2022 Takes ~15 seconds to create all 16 accounts" }), _jsx("li", { children: "\u2022 Example: kishan@weddingapp.test / test123@" })] })] }), _jsx("button", { type: "submit", disabled: loading || !password || password.length < 6, className: "w-full bg-rose-gold hover:bg-rose-gold/90 disabled:opacity-50 text-white font-medium py-3 rounded-lg transition", children: loading ? `Creating Accounts...` : 'Create All 16 Accounts' }), _jsxs("div", { className: "p-4 bg-green-50 rounded-lg border border-green-200", children: [_jsx("p", { className: "text-sm text-green-700 font-medium mb-2", children: "After setup, login with:" }), _jsx("p", { className: "text-sm text-green-600", children: "Username: kishan (or any username)" }), _jsxs("p", { className: "text-sm text-green-600", children: ["Password: ", password] })] })] })] })] }) }));
}
