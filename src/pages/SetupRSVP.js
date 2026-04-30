import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Zap, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import { generateAllRSVPTokens } from '../lib/generateRSVPTokens';
export default function SetupRSVP() {
    const [loading, setLoading] = useState(false);
    const [completed, setCompleted] = useState(false);
    const [count, setCount] = useState(0);
    const handleGenerateTokens = async () => {
        setLoading(true);
        try {
            const result = await generateAllRSVPTokens();
            if (result.success) {
                setCount(result.count || 0);
                setCompleted(true);
                toast.success(`✅ Generated ${result.count || 0} RSVP tokens`);
            }
            else {
                toast.error('Failed to generate tokens');
            }
        }
        catch (error) {
            console.error(error);
            toast.error('Error generating tokens');
        }
        finally {
            setLoading(false);
        }
    };
    return (_jsx("div", { className: "min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-6", children: _jsx("div", { className: "max-w-2xl mx-auto", children: _jsxs("div", { className: "bg-white rounded-lg shadow-lg p-8", children: [_jsxs("div", { className: "text-center mb-8", children: [_jsx(Zap, { className: "w-12 h-12 text-purple-600 mx-auto mb-4" }), _jsx("h1", { className: "text-3xl font-bold text-gray-800", children: "RSVP System Setup" }), _jsx("p", { className: "text-gray-600 mt-2", children: "Generate secure RSVP tokens for all guests" })] }), !completed ? (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "bg-blue-50 border border-blue-200 rounded-lg p-4", children: [_jsx("h2", { className: "font-semibold text-blue-900 mb-2", children: "What This Does:" }), _jsxs("ul", { className: "text-sm text-blue-800 space-y-1", children: [_jsx("li", { children: "\u2705 Generates unique RSVP tokens for all 294 guests" }), _jsx("li", { children: "\u2705 Stores tokens in the guests table" }), _jsx("li", { children: "\u2705 Enables secure `/rsvp/:token` URLs" }), _jsx("li", { children: "\u2705 Allows guests to RSVP without login" })] })] }), _jsxs("button", { onClick: handleGenerateTokens, disabled: loading, className: "w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold py-4 rounded-lg hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 transition-all text-lg flex items-center justify-center gap-2", children: [_jsx(Zap, { className: "w-5 h-5" }), loading ? 'Generating Tokens...' : 'Generate RSVP Tokens for All Guests'] }), _jsx("div", { className: "bg-amber-50 border border-amber-200 rounded-lg p-4", children: _jsxs("p", { className: "text-sm text-amber-800", children: [_jsx("strong", { children: "Note:" }), " This one-time setup generates unique tokens for each guest. After this, guests can scan QR codes from Social Hub to RSVP."] }) })] })) : (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "bg-green-50 border border-green-200 rounded-lg p-6 text-center", children: [_jsx(CheckCircle2, { className: "w-12 h-12 text-green-600 mx-auto mb-3" }), _jsx("h2", { className: "text-xl font-bold text-green-800 mb-2", children: "Setup Complete! \u2705" }), _jsxs("p", { className: "text-green-700 mb-4", children: ["Generated ", _jsx("strong", { children: count }), " RSVP tokens"] }), _jsxs("p", { className: "text-sm text-green-600", children: ["Guests can now scan QR codes from ", _jsx("strong", { children: "Social Hub" }), " to RSVP"] })] }), _jsxs("div", { className: "bg-purple-50 border border-purple-200 rounded-lg p-4 space-y-2", children: [_jsx("h3", { className: "font-semibold text-purple-900", children: "Next Steps:" }), _jsxs("ol", { className: "text-sm text-purple-800 space-y-1", children: [_jsxs("li", { children: ["1. Go to ", _jsx("strong", { children: "Social Hub" }), " from sidebar"] }), _jsx("li", { children: "2. Select a guest from dropdown" }), _jsxs("li", { children: ["3. Click ", _jsx("strong", { children: "\"Show QR Code\"" })] }), _jsx("li", { children: "4. Download or share QR code \u2192 guests scan to RSVP" })] })] }), _jsx("a", { href: "/", className: "block text-center bg-purple-600 text-white font-semibold py-3 rounded-lg hover:bg-purple-700 transition", children: "\u2190 Back to Dashboard" })] }))] }) }) }));
}
