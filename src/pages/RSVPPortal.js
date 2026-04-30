import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { CheckCircle2, XCircle, HelpCircle } from 'lucide-react';
import { toast } from 'sonner';
export default function RSVPPortal() {
    const { token } = useParams();
    const navigate = useNavigate();
    const [guest, setGuest] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    useEffect(() => {
        const loadGuest = async () => {
            if (!token) {
                toast.error('Invalid RSVP link');
                return;
            }
            const { data, error } = await supabase
                .from('guests')
                .select('id,name,city,pax_total,side,rsvp_status')
                .eq('qr_token', token)
                .single();
            if (error || !data) {
                toast.error('Guest not found');
                console.error(error);
            }
            else {
                setGuest(data);
            }
            setLoading(false);
        };
        loadGuest();
    }, [token]);
    const handleRSVP = async (status) => {
        if (!guest)
            return;
        setSubmitting(true);
        const { error } = await supabase
            .from('guests')
            .update({ rsvp_status: status })
            .eq('id', guest.id);
        if (error) {
            toast.error('Failed to submit RSVP');
            console.error(error);
        }
        else {
            setGuest({ ...guest, rsvp_status: status });
            setSubmitted(true);
            toast.success('RSVP submitted successfully!');
            setTimeout(() => {
                navigate('/');
            }, 3000);
        }
        setSubmitting(false);
    };
    if (loading)
        return (_jsx("div", { className: "min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-gold/10 via-mauve/10 to-gold/10", children: _jsxs("div", { className: "text-center", children: [_jsx("div", { className: "inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-mauve mb-4" }), _jsx("p", { className: "text-gray-700 font-medium", children: "Loading..." })] }) }));
    if (!guest)
        return (_jsx("div", { className: "min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-gold/10 via-mauve/10 to-gold/10 p-4", children: _jsxs("div", { className: "bg-white rounded-lg shadow-lg p-8 text-center max-w-md", children: [_jsx("h1", { className: "text-2xl font-bold text-gray-800 mb-2", children: "Invalid RSVP Link" }), _jsx("p", { className: "text-gray-600", children: "This RSVP link is not valid. Please check the link or contact the couple." })] }) }));
    return (_jsx("div", { className: "min-h-screen bg-gradient-to-br from-rose-gold/10 via-mauve/10 to-gold/10 flex items-center justify-center p-4", children: _jsxs("div", { className: "bg-white rounded-lg shadow-2xl max-w-md w-full overflow-hidden", children: [_jsxs("div", { className: "bg-gradient-to-r from-mauve to-rose-gold p-8 text-center text-white", children: [_jsx("h1", { className: "text-3xl font-bold mb-2", children: "\uD83D\uDC8D Wedding Invitation \uD83D\uDC8D" }), _jsx("p", { className: "text-sm opacity-90", children: "Kishan & Megha" }), _jsx("p", { className: "text-xs opacity-75", children: "June 21-22, 2026 | Leo Resorts, Junagadh" })] }), _jsx("div", { className: "p-8 space-y-6", children: !submitted ? (_jsxs(_Fragment, { children: [_jsxs("div", { className: "text-center", children: [_jsx("p", { className: "text-sm text-gray-600 mb-1", children: "Welcome," }), _jsx("h2", { className: "text-2xl font-bold text-gray-800 mb-1", children: guest.name }), _jsxs("p", { className: "text-xs text-gray-600", children: [guest.side, " Side \u2022 ", guest.city] }), _jsxs("p", { className: "text-lg font-semibold text-mauve mt-2", children: [guest.pax_total, " person(s)"] })] }), _jsxs("div", { className: "text-center", children: [_jsx("p", { className: "text-gray-700 font-medium mb-2", children: "Please confirm your attendance:" }), _jsx("p", { className: "text-sm text-gray-600", children: "Your response helps us plan better for our big day!" })] }), _jsxs("div", { className: "space-y-3", children: [_jsxs("button", { onClick: () => handleRSVP('Confirmed'), disabled: submitting, className: "w-full flex items-center justify-center gap-3 px-6 py-4 bg-green-100 hover:bg-green-200 text-green-800 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed", children: [_jsx(CheckCircle2, { className: "w-6 h-6" }), _jsx("span", { children: "\u2705 Yes, I'll be there!" })] }), _jsxs("button", { onClick: () => handleRSVP('Not Decided'), disabled: submitting, className: "w-full flex items-center justify-center gap-3 px-6 py-4 bg-yellow-100 hover:bg-yellow-200 text-yellow-800 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed", children: [_jsx(HelpCircle, { className: "w-6 h-6" }), _jsx("span", { children: "\uD83E\uDD14 Still thinking..." })] }), _jsxs("button", { onClick: () => handleRSVP('Declined'), disabled: submitting, className: "w-full flex items-center justify-center gap-3 px-6 py-4 bg-red-100 hover:bg-red-200 text-red-800 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed", children: [_jsx(XCircle, { className: "w-6 h-6" }), _jsx("span", { children: "\u274C Can't make it" })] })] }), _jsxs("div", { className: "bg-blue-50 border border-blue-200 rounded-lg p-4 text-xs text-blue-800 text-center", children: [_jsx("p", { className: "font-medium", children: "Current Status:" }), _jsx("p", { className: "text-sm font-semibold mt-1", children: guest.rsvp_status })] })] })) : (_jsxs(_Fragment, { children: [_jsxs("div", { className: "text-center", children: [_jsx("div", { className: "inline-block bg-green-100 rounded-full p-4 mb-4", children: _jsx(CheckCircle2, { className: "w-12 h-12 text-green-600" }) }), _jsx("h2", { className: "text-2xl font-bold text-green-700 mb-2", children: "Thank You!" }), _jsxs("p", { className: "text-gray-700 mb-4", children: ["We've received your RSVP as ", _jsx("strong", { children: guest.rsvp_status })] }), _jsx("p", { className: "text-sm text-gray-600", children: "We look forward to celebrating with you! \uD83C\uDF89" })] }), _jsx("div", { className: "bg-blue-50 border border-blue-200 rounded-lg p-3 text-center text-xs text-blue-800", children: "Redirecting in a moment..." })] })) }), _jsx("div", { className: "bg-gray-50 px-8 py-4 text-center text-xs text-gray-600 border-t border-gray-200", children: "If you have any questions, please contact the couple directly." })] }) }));
}
