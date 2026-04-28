import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { Heart, Mail, Lock, AlertCircle } from 'lucide-react';
export default function Auth() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [isSignUp, setIsSignUp] = useState(false);
    const handleAuth = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            if (isSignUp) {
                const { error } = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        data: { role: 'couple' },
                    },
                });
                if (error)
                    throw error;
                setEmail('');
                setPassword('');
                setIsSignUp(false);
                setError('Check your email to confirm signup!');
            }
            else {
                const { error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });
                if (error)
                    throw error;
            }
        }
        catch (err) {
            setError(err.message || 'Authentication error');
        }
        finally {
            setLoading(false);
        }
    };
    return (_jsx("div", { className: "min-h-screen bg-gradient-to-br from-cream via-rose-gold/10 to-mauve/10 flex items-center justify-center p-4", children: _jsxs("div", { className: "w-full max-w-md", children: [_jsxs("div", { className: "text-center mb-8", children: [_jsxs("div", { className: "flex items-center justify-center gap-2 mb-4", children: [_jsx(Heart, { className: "w-8 h-8 text-rose-gold fill-rose-gold" }), _jsx("h1", { className: "text-3xl font-bold text-mauve", children: "Wedding App" })] }), _jsx("p", { className: "text-gray-600", children: "Kishan & Megha | June 21\u201322, 2026" })] }), _jsxs("div", { className: "bg-white rounded-lg shadow-lg p-8", children: [_jsx("h2", { className: "text-2xl font-bold text-gray-800 mb-6", children: isSignUp ? 'Create Account' : 'Sign In' }), error && (_jsxs("div", { className: `mb-4 p-3 rounded-lg flex gap-2 ${error.includes('Check')
                                ? 'bg-green-50 text-green-700 border border-green-200'
                                : 'bg-red-50 text-red-700 border border-red-200'}`, children: [_jsx(AlertCircle, { className: "w-5 h-5 flex-shrink-0 mt-0.5" }), _jsx("p", { className: "text-sm", children: error })] })), _jsxs("form", { onSubmit: handleAuth, className: "space-y-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Email" }), _jsxs("div", { className: "relative", children: [_jsx(Mail, { className: "absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" }), _jsx("input", { type: "email", value: email, onChange: (e) => setEmail(e.target.value), placeholder: "kishan@example.com", required: true, className: "w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-gold focus:border-transparent outline-none" })] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Password" }), _jsxs("div", { className: "relative", children: [_jsx(Lock, { className: "absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" }), _jsx("input", { type: "password", value: password, onChange: (e) => setPassword(e.target.value), placeholder: "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022", required: true, className: "w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-gold focus:border-transparent outline-none" })] })] }), _jsx("button", { type: "submit", disabled: loading, className: "w-full bg-rose-gold hover:bg-rose-gold/90 disabled:opacity-50 text-white font-medium py-2 rounded-lg transition", children: loading ? 'Loading...' : isSignUp ? 'Sign Up' : 'Sign In' })] }), _jsxs("p", { className: "text-center text-sm text-gray-600 mt-6", children: [isSignUp ? 'Already have an account?' : "Don't have an account?", ' ', _jsx("button", { onClick: () => {
                                        setIsSignUp(!isSignUp);
                                        setError('');
                                    }, className: "text-rose-gold hover:text-rose-gold/80 font-medium", children: isSignUp ? 'Sign In' : 'Sign Up' })] })] }), _jsx("p", { className: "text-center text-xs text-gray-500 mt-6", children: "Demo: Use email with any password to sign up, then sign in" })] }) }));
}
