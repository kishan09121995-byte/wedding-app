import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { useGuestStore } from '../store/guestStore';
import { supabase } from '../lib/supabase';
import { Plus, Trash2, Copy, Share2, QrCode } from 'lucide-react';
import QRCode from 'qrcode.react';
import { toast } from 'sonner';
const PLATFORMS = ['Instagram', 'WhatsApp', 'YouTube', 'Facebook', 'TikTok'];
export default function SocialHub() {
    const guests = useGuestStore((state) => state.guests);
    const [handles, setHandles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [newHandle, setNewHandle] = useState({ platform: 'Instagram', handle: '', url: '' });
    const [selectedGuest, setSelectedGuest] = useState(guests[0]?.id || '');
    const [qrGuest, setQrGuest] = useState(null);
    useEffect(() => {
        const loadHandles = async () => {
            const { data, error } = await supabase.from('social_handles').select('*');
            if (error)
                console.error('Error loading handles:', error);
            if (data)
                setHandles(data);
            setLoading(false);
        };
        loadHandles();
    }, []);
    const handleAddHandle = async () => {
        if (!newHandle.handle.trim()) {
            toast.error('Please enter a handle');
            return;
        }
        setSaving(true);
        const { data, error } = await supabase
            .from('social_handles')
            .insert([newHandle])
            .select();
        if (error) {
            toast.error('Failed to add handle');
            console.error(error);
        }
        else if (data) {
            setHandles([...handles, data[0]]);
            setNewHandle({ platform: 'Instagram', handle: '', url: '' });
            toast.success('Handle added');
        }
        setSaving(false);
    };
    const handleDeleteHandle = async (handleId) => {
        setSaving(true);
        const { error } = await supabase.from('social_handles').delete().eq('id', handleId);
        if (error) {
            toast.error('Failed to delete handle');
            console.error(error);
        }
        else {
            setHandles((prev) => prev.filter((h) => h.id !== handleId));
            toast.success('Handle deleted');
        }
        setSaving(false);
    };
    const currentGuest = guests.find((g) => g.id === selectedGuest);
    const rsvpUrl = `${window.location.origin}/rsvp/${currentGuest?.id}`;
    const generateWhatsAppMessage = () => {
        if (!currentGuest)
            return '';
        return `Hi ${currentGuest.name}! 👋\n\nWe'd love to have you at our wedding! 💍\n\nPlease confirm your attendance here:\n${rsvpUrl}\n\nJoin us for an unforgettable celebration! 🎉`;
    };
    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        toast.success('Copied to clipboard!');
    };
    if (loading)
        return _jsx("div", { className: "p-6", children: "Loading..." });
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-2xl font-bold text-gray-800", children: "Social Hub" }), _jsx("p", { className: "text-gray-600 text-sm mt-1", children: "Manage social handles and generate guest RSVP links & QR codes" })] }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-6", children: [_jsxs("div", { className: "bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden", children: [_jsx("div", { className: "bg-gray-100 p-4 border-b border-gray-200", children: _jsx("h2", { className: "text-lg font-bold text-gray-800", children: "Couple's Social Handles" }) }), _jsxs("div", { className: "p-6 space-y-4", children: [_jsxs("div", { className: "space-y-3", children: [_jsx("select", { value: newHandle.platform, onChange: (e) => setNewHandle({ ...newHandle, platform: e.target.value }), className: "w-full px-3 py-2 border border-gray-300 rounded-lg text-sm", children: PLATFORMS.map((p) => (_jsx("option", { value: p, children: p }, p))) }), _jsx("input", { type: "text", placeholder: "Handle (e.g., @kishan_megha)", value: newHandle.handle, onChange: (e) => setNewHandle({ ...newHandle, handle: e.target.value }), className: "w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" }), _jsx("input", { type: "url", placeholder: "URL (e.g., https://instagram.com/...)", value: newHandle.url, onChange: (e) => setNewHandle({ ...newHandle, url: e.target.value }), className: "w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" }), _jsxs("button", { onClick: handleAddHandle, disabled: saving, className: "w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50", children: [_jsx(Plus, { className: "w-4 h-4" }), "Add Handle"] })] }), _jsx("div", { className: "space-y-2 border-t border-gray-200 pt-4", children: handles.length === 0 ? (_jsx("p", { className: "text-gray-600 text-sm", children: "No social handles yet" })) : (handles.map((handle) => (_jsxs("div", { className: "flex items-center justify-between p-3 bg-gray-50 rounded-lg", children: [_jsxs("div", { className: "flex-1", children: [_jsx("p", { className: "text-sm font-semibold text-gray-800", children: handle.platform }), _jsx("p", { className: "text-xs text-gray-600", children: handle.handle })] }), _jsxs("div", { className: "flex gap-2", children: [_jsx("a", { href: handle.url, target: "_blank", rel: "noreferrer", className: "p-2 hover:bg-white rounded-lg transition-colors", title: "Visit", children: _jsx(Share2, { className: "w-4 h-4 text-blue-600" }) }), _jsx("button", { onClick: () => handleDeleteHandle(handle.id), disabled: saving, className: "p-2 hover:bg-red-100 rounded-lg transition-colors disabled:opacity-50", title: "Delete", children: _jsx(Trash2, { className: "w-4 h-4 text-red-600" }) })] })] }, handle.id)))) })] })] }), _jsxs("div", { className: "bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden", children: [_jsx("div", { className: "bg-gray-100 p-4 border-b border-gray-200", children: _jsx("h2", { className: "text-lg font-bold text-gray-800", children: "Guest RSVP & QR" }) }), _jsxs("div", { className: "p-6 space-y-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Select Guest" }), _jsx("select", { value: selectedGuest, onChange: (e) => setSelectedGuest(e.target.value), className: "w-full px-3 py-2 border border-gray-300 rounded-lg text-sm", children: guests.map((g) => (_jsxs("option", { value: g.id, children: [g.name, " (", g.city, ")"] }, g.id))) })] }), currentGuest && (_jsxs(_Fragment, { children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "RSVP Portal Link" }), _jsxs("div", { className: "flex gap-2", children: [_jsx("input", { type: "text", value: rsvpUrl, readOnly: true, className: "flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm bg-gray-50" }), _jsx("button", { onClick: () => copyToClipboard(rsvpUrl), className: "p-2 hover:bg-blue-100 rounded-lg transition-colors", title: "Copy", children: _jsx(Copy, { className: "w-5 h-5 text-blue-600" }) })] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "WhatsApp Message" }), _jsx("textarea", { value: generateWhatsAppMessage(), readOnly: true, className: "w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-gray-50 h-24" }), _jsxs("a", { href: `https://wa.me/?text=${encodeURIComponent(generateWhatsAppMessage())}`, target: "_blank", rel: "noreferrer", className: "mt-2 inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium", children: [_jsx(Share2, { className: "w-4 h-4" }), "Open WhatsApp"] })] }), _jsxs("div", { children: [_jsxs("button", { onClick: () => setQrGuest(qrGuest === currentGuest.id ? null : currentGuest.id), className: "w-full flex items-center justify-center gap-2 px-4 py-2 bg-purple-100 text-purple-800 rounded-lg hover:bg-purple-200 transition-colors text-sm font-medium", children: [_jsx(QrCode, { className: "w-4 h-4" }), qrGuest === currentGuest.id ? 'Hide QR' : 'Show QR Code'] }), qrGuest === currentGuest.id && (_jsxs("div", { className: "mt-4 flex flex-col items-center bg-gray-50 p-4 rounded-lg", children: [_jsx(QRCode, { value: rsvpUrl, size: 200, level: "H", includeMargin: true }), _jsxs("p", { className: "text-xs text-gray-600 mt-3 text-center", children: ["Scan to RSVP: ", currentGuest.name] }), _jsx("button", { onClick: () => {
                                                                    const qrCanvas = document.querySelector('canvas');
                                                                    if (qrCanvas) {
                                                                        const link = document.createElement('a');
                                                                        link.href = qrCanvas.toDataURL();
                                                                        link.download = `qr-${currentGuest.name}.png`;
                                                                        link.click();
                                                                    }
                                                                }, className: "mt-3 px-3 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700 transition-colors", children: "Download QR" })] }))] })] }))] })] })] })] }));
}
