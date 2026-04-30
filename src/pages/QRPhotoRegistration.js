import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useRef } from 'react';
import { Search, Download, User, AlertCircle, CheckCircle2, Upload, Camera } from 'lucide-react';
import { toast } from 'sonner';
const BACKEND_URL = 'https://wedding-gallery-backend-with-ai-photo-matching-production.up.railway.app';
export default function QRPhotoRegistration() {
    const [name, setName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [searchedPhotos, setSearchedPhotos] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searched, setSearched] = useState(false);
    const [registering, setRegistering] = useState(false);
    const [showRegisterMode, setShowRegisterMode] = useState(false);
    const fileInputRef = useRef(null);
    const handleSearch = async () => {
        if (!name.trim()) {
            toast.error('Enter your name');
            return;
        }
        setLoading(true);
        setSearched(true);
        try {
            const response = await fetch(`${BACKEND_URL}/api/photos/${encodeURIComponent(name.trim())}`);
            if (!response.ok) {
                throw new Error('Failed to fetch photos');
            }
            const data = await response.json();
            setSearchedPhotos(data.photos || []);
            if (!data.photos || data.photos.length === 0) {
                toast.info(`No photos found for "${name}". Try registering your face first!`);
            }
            else {
                toast.success(`Found ${data.photos.length} photos`);
            }
        }
        catch (error) {
            console.error('Search error:', error);
            toast.error('Failed to search photos. Please try again.');
        }
        finally {
            setLoading(false);
        }
    };
    const handleRegisterFace = async (file) => {
        if (!name.trim()) {
            toast.error('Please enter your name first');
            return;
        }
        setRegistering(true);
        try {
            const formData = new FormData();
            formData.append('selfie', file);
            formData.append('userId', name.trim());
            const response = await fetch(`${BACKEND_URL}/api/register`, {
                method: 'POST',
                body: formData
            });
            if (!response.ok) {
                throw new Error('Failed to register face');
            }
            toast.success('✅ Face registered! You can now search for your photos.');
            setShowRegisterMode(false);
        }
        catch (error) {
            console.error('Registration error:', error);
            toast.error('Failed to register face. Please try again.');
        }
        finally {
            setRegistering(false);
        }
    };
    const handleFileSelect = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            handleRegisterFace(file);
        }
    };
    const handleDownload = (photoUrl) => {
        const link = document.createElement('a');
        link.href = photoUrl;
        link.download = `wedding-photo-${Date.now()}.jpg`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success('Photo downloaded!');
    };
    return (_jsx("div", { className: "min-h-screen bg-gradient-to-br from-rose-50 to-pink-50 p-6", children: _jsxs("div", { className: "max-w-2xl mx-auto", children: [_jsxs("div", { className: "text-center mb-8", children: [_jsx("h1", { className: "text-4xl font-bold text-gray-800 mb-2", children: "\uD83D\uDCF7 Find Your Photos" }), _jsx("p", { className: "text-gray-600", children: "Find and download your wedding photos from Google Drive" })] }), _jsxs("div", { className: "flex gap-3 mb-6", children: [_jsxs("button", { onClick: () => setShowRegisterMode(false), className: `flex-1 py-3 rounded-lg font-semibold transition ${!showRegisterMode
                                ? 'bg-rose-500 text-white'
                                : 'bg-white text-gray-700 border-2 border-gray-200'}`, children: [_jsx(Search, { className: "w-4 h-4 inline mr-2" }), "Find My Photos"] }), _jsxs("button", { onClick: () => setShowRegisterMode(true), className: `flex-1 py-3 rounded-lg font-semibold transition ${showRegisterMode
                                ? 'bg-rose-500 text-white'
                                : 'bg-white text-gray-700 border-2 border-gray-200'}`, children: [_jsx(Camera, { className: "w-4 h-4 inline mr-2" }), "Register Your Face"] })] }), _jsx("div", { className: "bg-white rounded-lg shadow-lg p-8 mb-6", children: !showRegisterMode ? (_jsxs(_Fragment, { children: [_jsx("h2", { className: "text-2xl font-bold text-gray-800 mb-6", children: "Search for Your Photos" }), _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { children: [_jsxs("label", { className: "flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2", children: [_jsx(User, { className: "w-4 h-4" }), "Full Name"] }), _jsx("input", { type: "text", placeholder: "Enter your full name", value: name, onChange: (e) => setName(e.target.value), onKeyPress: (e) => e.key === 'Enter' && handleSearch(), className: "w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-rose-500 focus:ring-2 focus:ring-rose-200 transition-all" })] }), _jsxs("button", { onClick: handleSearch, disabled: loading, className: "w-full bg-gradient-to-r from-rose-500 to-pink-500 text-white font-semibold py-3 rounded-lg hover:from-rose-600 hover:to-pink-600 disabled:opacity-50 transition-all flex items-center justify-center gap-2", children: [_jsx(Search, { className: "w-5 h-5" }), loading ? 'Searching...' : 'Find My Photos'] })] }), _jsxs("div", { className: "mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-start gap-3", children: [_jsx(AlertCircle, { className: "w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" }), _jsx("p", { className: "text-sm text-blue-700", children: "Your wedding photos are stored in Google Drive and tagged by guest name. Register your face first to enable photo matching!" })] })] })) : (_jsxs(_Fragment, { children: [_jsx("h2", { className: "text-2xl font-bold text-gray-800 mb-6", children: "Register Your Face" }), _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { children: [_jsxs("label", { className: "flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2", children: [_jsx(User, { className: "w-4 h-4" }), "Full Name"] }), _jsx("input", { type: "text", placeholder: "Enter your full name", value: name, onChange: (e) => setName(e.target.value), className: "w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-rose-500 focus:ring-2 focus:ring-rose-200 transition-all" })] }), _jsxs("div", { children: [_jsxs("label", { className: "flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2", children: [_jsx(Camera, { className: "w-4 h-4" }), "Upload a Clear Face Photo"] }), _jsxs("button", { onClick: () => fileInputRef.current?.click(), disabled: registering, className: "w-full px-4 py-8 border-2 border-dashed border-rose-300 rounded-lg hover:border-rose-500 transition flex flex-col items-center gap-2 text-gray-600 disabled:opacity-50", children: [_jsx(Upload, { className: "w-8 h-8 text-rose-500" }), _jsx("span", { className: "font-medium", children: "Click to upload or drag & drop" }), _jsx("span", { className: "text-xs", children: "PNG, JPG up to 10MB" })] }), _jsx("input", { ref: fileInputRef, type: "file", accept: "image/*", onChange: handleFileSelect, className: "hidden" })] }), _jsxs("button", { disabled: !name.trim() || registering, className: "w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold py-3 rounded-lg hover:from-green-600 hover:to-emerald-600 disabled:opacity-50 transition-all flex items-center justify-center gap-2", children: [_jsx(CheckCircle2, { className: "w-5 h-5" }), registering ? 'Registering...' : 'Register Face'] })] }), _jsxs("div", { className: "mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-3", children: [_jsx(AlertCircle, { className: "w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" }), _jsx("p", { className: "text-sm text-amber-700", children: "Upload a clear, front-facing photo. We'll use face recognition to match and find all your tagged photos from Google Drive!" })] })] })) }), searched && (_jsx("div", { className: "space-y-4", children: searchedPhotos.length === 0 ? (_jsxs("div", { className: "bg-white rounded-lg p-8 text-center border-2 border-dashed border-gray-300", children: [_jsx(AlertCircle, { className: "w-12 h-12 text-gray-400 mx-auto mb-3" }), _jsx("p", { className: "text-gray-600 font-medium", children: "No photos found" }), _jsx("p", { className: "text-sm text-gray-500 mt-1", children: "Make sure you've registered your face first, then try searching again." })] })) : (_jsxs("div", { children: [_jsxs("h2", { className: "text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2", children: [_jsx(CheckCircle2, { className: "w-6 h-6 text-green-600" }), "Your Photos (", searchedPhotos.length, ")"] }), _jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4", children: searchedPhotos.map((photo, idx) => (_jsxs("div", { className: "bg-white rounded-lg overflow-hidden shadow hover:shadow-lg transition-shadow", children: [_jsxs("div", { className: "relative aspect-square bg-gray-100 overflow-hidden group", children: [_jsx("img", { src: photo.cloudinary_url, alt: "Wedding photo", className: "w-full h-full object-cover group-hover:scale-105 transition-transform", onError: (e) => {
                                                        e.currentTarget.src = 'https://via.placeholder.com/300?text=Photo+Not+Found';
                                                    } }), _jsx("div", { className: "absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center", children: _jsx("span", { className: "text-white text-sm font-semibold", children: "Hover to download" }) })] }), _jsxs("div", { className: "p-3 space-y-2", children: [photo.ai_tags && (_jsxs("p", { className: "text-xs text-gray-500", children: [_jsx("span", { className: "font-semibold", children: "Tags:" }), " ", photo.ai_tags] })), _jsxs("button", { onClick: () => handleDownload(photo.cloudinary_url), className: "w-full bg-rose-500 hover:bg-rose-600 text-white py-2 rounded-lg flex items-center justify-center gap-2 transition-colors text-sm font-medium", children: [_jsx(Download, { className: "w-4 h-4" }), "Download"] })] })] }, idx))) })] })) }))] }) }));
}
