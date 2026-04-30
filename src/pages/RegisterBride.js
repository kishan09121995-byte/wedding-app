import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from 'react';
import { Phone, Lock, CheckCircle2, AlertCircle, Loader } from 'lucide-react';
import { toast } from 'sonner';
const BACKEND_URL = 'https://wedding-gallery-backend-with-ai-photo-matching-production.up.railway.app';
export default function RegisterBride() {
    const [step, setStep] = useState('phone');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [otpCode, setOtpCode] = useState('');
    const [loading, setLoading] = useState(false);
    const [guestData, setGuestData] = useState(null);
    const [sessionToken, setSessionToken] = useState('');
    const handleGenerateOTP = async (e) => {
        e.preventDefault();
        if (!phoneNumber.trim()) {
            toast.error('Please enter phone number');
            return;
        }
        setLoading(true);
        try {
            const response = await fetch(`${BACKEND_URL}/api/auth/generate-otp`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ phone_number: phoneNumber }),
            });
            const data = await response.json();
            if (!response.ok)
                throw new Error(data.error || 'Failed to generate OTP');
            toast.success('OTP sent to your phone!');
            setStep('otp');
        }
        catch (error) {
            toast.error(error instanceof Error ? error.message : 'Failed to generate OTP');
        }
        finally {
            setLoading(false);
        }
    };
    const handleVerifyOTP = async (e) => {
        e.preventDefault();
        if (!otpCode.trim()) {
            toast.error('Please enter OTP');
            return;
        }
        setLoading(true);
        try {
            const response = await fetch(`${BACKEND_URL}/api/auth/verify-otp`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    phone_number: phoneNumber,
                    otp_code: otpCode,
                    affiliation: 'Bride',
                }),
            });
            const data = await response.json();
            if (!response.ok)
                throw new Error(data.error || 'OTP verification failed');
            setSessionToken(data.session_token);
            setGuestData(data.guest);
            setStep('success');
            toast.success('Registration successful! 🎉');
        }
        catch (error) {
            toast.error(error instanceof Error ? error.message : 'OTP verification failed');
        }
        finally {
            setLoading(false);
        }
    };
    return (_jsxs("div", { className: "min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50", children: [_jsx("div", { className: "bg-gradient-to-r from-pink-600 to-rose-600 text-white py-8 px-4", children: _jsxs("div", { className: "max-w-2xl mx-auto text-center", children: [_jsx("h1", { className: "text-4xl font-bold mb-2", children: "\uD83D\uDC8D Bride's Side Registration" }), _jsx("p", { className: "text-pink-100", children: "Verify your phone number to access wedding updates" })] }) }), _jsxs("div", { className: "max-w-md mx-auto px-4 py-8", children: [step === 'phone' && (_jsxs("div", { className: "bg-white rounded-lg shadow-lg p-8", children: [_jsxs("div", { className: "flex items-center gap-3 mb-6", children: [_jsx("div", { className: "flex items-center justify-center w-10 h-10 rounded-full bg-pink-600 text-white font-bold", children: "1" }), _jsx("h2", { className: "text-2xl font-bold text-gray-800", children: "Enter Phone Number" })] }), _jsxs("form", { onSubmit: handleGenerateOTP, className: "space-y-4", children: [_jsxs("div", { children: [_jsxs("label", { className: "flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2", children: [_jsx(Phone, { className: "w-4 h-4" }), "Phone Number"] }), _jsx("input", { type: "tel", value: phoneNumber, onChange: (e) => setPhoneNumber(e.target.value), placeholder: "+91 9876543210", className: "w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-pink-500 focus:ring-2 focus:ring-pink-200 transition-all" }), _jsx("p", { className: "text-xs text-gray-500 mt-2", children: "Enter the phone number registered with us" })] }), _jsx("button", { type: "submit", disabled: loading, className: "w-full bg-gradient-to-r from-pink-600 to-rose-600 text-white font-bold py-3 rounded-lg hover:from-pink-700 hover:to-rose-700 disabled:opacity-50 transition-all flex items-center justify-center gap-2", children: loading ? (_jsxs(_Fragment, { children: [_jsx(Loader, { className: "w-5 h-5 animate-spin" }), "Sending OTP..."] })) : ('Send OTP') })] }), _jsx("div", { className: "mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg", children: _jsxs("p", { className: "text-sm text-blue-800", children: [_jsx(AlertCircle, { className: "w-4 h-4 inline mr-2" }), "Make sure you have access to this phone number to receive the OTP."] }) })] })), step === 'otp' && (_jsxs("div", { className: "bg-white rounded-lg shadow-lg p-8", children: [_jsxs("div", { className: "flex items-center gap-3 mb-6", children: [_jsx("div", { className: "flex items-center justify-center w-10 h-10 rounded-full bg-pink-600 text-white font-bold", children: "2" }), _jsx("h2", { className: "text-2xl font-bold text-gray-800", children: "Enter OTP" })] }), _jsxs("form", { onSubmit: handleVerifyOTP, className: "space-y-4", children: [_jsxs("div", { children: [_jsxs("label", { className: "flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2", children: [_jsx(Lock, { className: "w-4 h-4" }), "One-Time Password"] }), _jsx("input", { type: "text", value: otpCode, onChange: (e) => setOtpCode(e.target.value.slice(0, 6)), placeholder: "000000", maxLength: 6, className: "w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-pink-500 focus:ring-2 focus:ring-pink-200 transition-all text-center text-2xl letter-spacing tracking-widest" }), _jsx("p", { className: "text-xs text-gray-500 mt-2", children: "Check your phone for the 6-digit code" })] }), _jsx("button", { type: "submit", disabled: loading, className: "w-full bg-gradient-to-r from-pink-600 to-rose-600 text-white font-bold py-3 rounded-lg hover:from-pink-700 hover:to-rose-700 disabled:opacity-50 transition-all flex items-center justify-center gap-2", children: loading ? (_jsxs(_Fragment, { children: [_jsx(Loader, { className: "w-5 h-5 animate-spin" }), "Verifying..."] })) : ('Verify OTP') }), _jsx("button", { type: "button", onClick: () => setStep('phone'), className: "w-full text-pink-600 font-semibold py-2 hover:text-pink-700", children: "\u2190 Back to Phone Number" })] })] })), step === 'success' && guestData && (_jsx("div", { className: "bg-white rounded-lg shadow-lg p-8", children: _jsxs("div", { className: "text-center", children: [_jsx(CheckCircle2, { className: "w-16 h-16 text-green-600 mx-auto mb-4" }), _jsx("h2", { className: "text-2xl font-bold text-gray-800 mb-4", children: "Registration Successful! \uD83C\uDF89" }), _jsxs("div", { className: "bg-pink-50 rounded-lg p-6 mb-6 text-left space-y-3", children: [_jsxs("div", { children: [_jsx("p", { className: "text-sm text-gray-600", children: "Guest Name" }), _jsx("p", { className: "text-lg font-bold text-gray-900", children: guestData.guest_name })] }), _jsxs("div", { children: [_jsx("p", { className: "text-sm text-gray-600", children: "Room Number" }), _jsx("p", { className: "text-lg font-bold text-gray-900", children: guestData.room_number || 'TBA' })] }), _jsxs("div", { children: [_jsx("p", { className: "text-sm text-gray-600", children: "Hotel" }), _jsx("p", { className: "text-lg font-bold text-gray-900", children: guestData.hotel_id })] }), _jsxs("div", { children: [_jsx("p", { className: "text-sm text-gray-600", children: "Party Size" }), _jsxs("p", { className: "text-lg font-bold text-gray-900", children: [guestData.pax_total, " guests"] })] })] }), _jsx("div", { className: "bg-green-50 border border-green-200 rounded-lg p-4 mb-6", children: _jsx("p", { className: "text-sm text-green-800", children: "\u2705 You're all set! Your information has been synced from our master guest list." }) }), _jsx("button", { onClick: () => {
                                        localStorage.setItem('wedding_session_token', sessionToken);
                                        window.location.href = '/';
                                    }, className: "w-full bg-gradient-to-r from-pink-600 to-rose-600 text-white font-bold py-3 rounded-lg hover:from-pink-700 hover:to-rose-700 transition-all", children: "Continue to Wedding Portal \u2192" })] }) }))] })] }));
}
