import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useRef, useEffect } from 'react';
import { Camera, Download, Heart, Share2, Phone, User, AlertCircle, CheckCircle2, Loader } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '../lib/supabase';
const BACKEND_URL = 'https://wedding-gallery-backend-with-ai-photo-matching-production.up.railway.app';
export default function PhotoPortal() {
    const [step, setStep] = useState('info');
    const [guestInfo, setGuestInfo] = useState({ name: '', phone: '', email: '' });
    const [selfieFile, setSelfieFile] = useState(null);
    const [selfiePreview, setSelfiePreview] = useState(null);
    const [matchedPhotos, setMatchedPhotos] = useState([]);
    const [loading, setLoading] = useState(false);
    const [favorites, setFavorites] = useState(new Set());
    const fileInputRef = useRef(null);
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const [useCamera, setUseCamera] = useState(false);
    useEffect(() => {
        if (useCamera && videoRef.current) {
            navigator.mediaDevices
                .getUserMedia({ video: { facingMode: 'user' } })
                .then(stream => {
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                }
            })
                .catch(err => toast.error('Camera access denied: ' + err.message));
        }
    }, [useCamera]);
    const handleGuestInfoSubmit = (e) => {
        e.preventDefault();
        if (!guestInfo.name.trim() || !guestInfo.phone.trim()) {
            toast.error('Please fill in name and phone number');
            return;
        }
        setStep('selfie');
    };
    const handleFileSelect = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelfieFile(file);
            setSelfiePreview(URL.createObjectURL(file));
            setUseCamera(false);
        }
    };
    const captureSelfie = () => {
        if (videoRef.current && canvasRef.current) {
            const context = canvasRef.current.getContext('2d');
            if (context) {
                context.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);
                canvasRef.current.toBlob(blob => {
                    if (blob) {
                        setSelfieFile(new File([blob], 'selfie.jpg', { type: 'image/jpeg' }));
                        setSelfiePreview(canvasRef.current.toDataURL());
                        setUseCamera(false);
                    }
                }, 'image/jpeg');
            }
        }
    };
    const logGuestInteraction = async (photosViewedCount = 0) => {
        try {
            const { error } = await supabase.from('guest_interactions').insert({
                guest_name: guestInfo.name,
                phone: guestInfo.phone,
                email: guestInfo.email,
                visited_at: new Date().toISOString(),
                photos_viewed: photosViewedCount,
                favorites_count: favorites.size
            });
            if (error)
                console.error('Error logging interaction:', error);
        }
        catch (err) {
            console.error('Failed to log guest interaction:', err);
        }
    };
    const handleFindPhotos = async () => {
        if (!selfieFile) {
            toast.error('Please select or capture a selfie');
            return;
        }
        setLoading(true);
        try {
            const formData = new FormData();
            formData.append('selfie', selfieFile);
            formData.append('name', guestInfo.name);
            formData.append('phone', guestInfo.phone);
            formData.append('email', guestInfo.email);
            const response = await fetch(`${BACKEND_URL}/api/find-my-photos`, {
                method: 'POST',
                body: formData
            });
            if (!response.ok) {
                throw new Error('Failed to find photos');
            }
            const data = await response.json();
            const photoCount = data.photos?.length || 0;
            setMatchedPhotos(data.photos || []);
            setStep('results');
            // Log the guest interaction
            await logGuestInteraction(photoCount);
            if (!data.photos || data.photos.length === 0) {
                toast.info('No matching photos found. Try adjusting lighting or angle.');
            }
            else {
                toast.success(`Found ${data.photos.length} photos of you! 🎉`);
            }
        }
        catch (error) {
            console.error('Error finding photos:', error);
            toast.error('Failed to process your selfie. Please try again.');
        }
        finally {
            setLoading(false);
        }
    };
    const toggleFavorite = async (photoId) => {
        const newFavorites = new Set(favorites);
        if (newFavorites.has(photoId)) {
            newFavorites.delete(photoId);
        }
        else {
            newFavorites.add(photoId);
        }
        setFavorites(newFavorites);
        // Update interaction record with new favorites count
        try {
            await supabase
                .from('guest_interactions')
                .update({ favorites_count: newFavorites.size })
                .eq('phone', guestInfo.phone)
                .order('visited_at', { ascending: false })
                .limit(1);
        }
        catch (err) {
            console.error('Failed to update favorites count:', err);
        }
    };
    const downloadPhoto = (url, photoId) => {
        const link = document.createElement('a');
        link.href = url;
        link.download = `wedding-photo-${photoId}.jpg`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success('Photo downloaded! 📸');
    };
    return (_jsxs("div", { className: "min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50", children: [_jsx("div", { className: "bg-gradient-to-r from-purple-600 to-pink-600 text-white py-8 px-4", children: _jsxs("div", { className: "max-w-4xl mx-auto text-center", children: [_jsx("h1", { className: "text-4xl font-bold mb-2", children: "\uD83D\uDC8D Find Your Photos" }), _jsx("p", { className: "text-pink-100", children: "Upload your face to discover all your wedding photos" })] }) }), _jsxs("div", { className: "max-w-4xl mx-auto px-4 py-8", children: [step === 'info' && (_jsxs("div", { className: "bg-white rounded-lg shadow-lg p-8 mb-8", children: [_jsxs("div", { className: "flex items-center gap-3 mb-6", children: [_jsx("div", { className: "flex items-center justify-center w-10 h-10 rounded-full bg-purple-600 text-white font-bold", children: "1" }), _jsx("h2", { className: "text-2xl font-bold text-gray-800", children: "Tell Us About You" })] }), _jsxs("form", { onSubmit: handleGuestInfoSubmit, className: "space-y-4", children: [_jsxs("div", { children: [_jsxs("label", { className: "flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2", children: [_jsx(User, { className: "w-4 h-4" }), "Full Name"] }), _jsx("input", { type: "text", value: guestInfo.name, onChange: (e) => setGuestInfo({ ...guestInfo, name: e.target.value }), placeholder: "Enter your full name", className: "w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all" })] }), _jsxs("div", { children: [_jsxs("label", { className: "flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2", children: [_jsx(Phone, { className: "w-4 h-4" }), "Phone Number"] }), _jsx("input", { type: "tel", value: guestInfo.phone, onChange: (e) => setGuestInfo({ ...guestInfo, phone: e.target.value }), placeholder: "+91 9876543210", className: "w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all" })] }), _jsxs("div", { children: [_jsx("label", { className: "text-sm font-semibold text-gray-700 mb-2", children: "Email (Optional)" }), _jsx("input", { type: "email", value: guestInfo.email, onChange: (e) => setGuestInfo({ ...guestInfo, email: e.target.value }), placeholder: "your@email.com", className: "w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all" })] }), _jsx("button", { type: "submit", className: "w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold py-3 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all mt-6", children: "Continue to Photo Matching \u2192" })] }), _jsx("div", { className: "mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg", children: _jsxs("p", { className: "text-sm text-blue-800", children: [_jsx(AlertCircle, { className: "w-4 h-4 inline mr-2" }), "Your information helps us send you your photos and create your guest profile."] }) })] })), step === 'selfie' && (_jsxs("div", { className: "bg-white rounded-lg shadow-lg p-8 mb-8", children: [_jsxs("div", { className: "flex items-center gap-3 mb-6", children: [_jsx("div", { className: "flex items-center justify-center w-10 h-10 rounded-full bg-purple-600 text-white font-bold", children: "2" }), _jsx("h2", { className: "text-2xl font-bold text-gray-800", children: "Upload Your Selfie" })] }), !selfiePreview ? (_jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "flex gap-4", children: [_jsxs("button", { onClick: () => setUseCamera(!useCamera), className: `flex-1 py-3 rounded-lg font-semibold transition flex items-center justify-center gap-2 ${useCamera
                                                    ? 'bg-purple-600 text-white'
                                                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`, children: [_jsx(Camera, { className: "w-5 h-5" }), useCamera ? 'Camera Active' : 'Use Camera'] }), _jsx("button", { onClick: () => fileInputRef.current?.click(), className: "flex-1 py-3 rounded-lg font-semibold bg-gray-200 text-gray-700 hover:bg-gray-300 transition flex items-center justify-center gap-2", children: "\uD83D\uDCC1 Upload File" })] }), useCamera ? (_jsxs("div", { className: "space-y-4", children: [_jsx("video", { ref: videoRef, autoPlay: true, playsInline: true, className: "w-full rounded-lg bg-black aspect-square object-cover" }), _jsx("canvas", { ref: canvasRef, className: "hidden", width: 640, height: 640 }), _jsx("button", { onClick: captureSelfie, className: "w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg transition", children: "\uD83D\uDCF8 Capture Selfie" })] })) : (_jsxs("div", { onClick: () => fileInputRef.current?.click(), className: "border-2 border-dashed border-purple-300 rounded-lg p-8 text-center cursor-pointer hover:border-purple-500 hover:bg-purple-50 transition", children: [_jsx(Camera, { className: "w-12 h-12 text-purple-400 mx-auto mb-3" }), _jsx("p", { className: "text-gray-600 font-medium", children: "Click to upload or drag & drop" }), _jsx("p", { className: "text-sm text-gray-500 mt-1", children: "JPG or PNG, up to 10MB" })] })), _jsx("input", { ref: fileInputRef, type: "file", accept: "image/*", onChange: handleFileSelect, className: "hidden" })] })) : (_jsxs("div", { className: "space-y-4", children: [_jsx("img", { src: selfiePreview, alt: "Your selfie", className: "w-full rounded-lg" }), _jsxs("div", { className: "flex gap-3", children: [_jsx("button", { onClick: () => {
                                                    setSelfiePreview(null);
                                                    setSelfieFile(null);
                                                }, className: "flex-1 py-3 rounded-lg font-semibold bg-gray-200 text-gray-700 hover:bg-gray-300 transition", children: "\u21BA Retake" }), _jsx("button", { onClick: handleFindPhotos, disabled: loading, className: "flex-1 py-3 rounded-lg font-semibold bg-green-600 text-white hover:bg-green-700 disabled:opacity-50 transition flex items-center justify-center gap-2", children: loading ? (_jsxs(_Fragment, { children: [_jsx(Loader, { className: "w-5 h-5 animate-spin" }), "Finding photos..."] })) : ('✨ Find My Photos') })] })] })), _jsx("div", { className: "mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg", children: _jsxs("p", { className: "text-sm text-amber-800", children: [_jsx(AlertCircle, { className: "w-4 h-4 inline mr-2" }), "Use a clear, front-facing photo in good lighting for best results."] }) })] })), step === 'results' && (_jsx("div", { className: "space-y-6", children: _jsxs("div", { className: "bg-white rounded-lg shadow-lg p-8", children: [_jsxs("div", { className: "flex items-center gap-3 mb-6", children: [_jsx(CheckCircle2, { className: "w-8 h-8 text-green-600" }), _jsx("h2", { className: "text-2xl font-bold text-gray-800", children: "Your Photos" })] }), matchedPhotos.length === 0 ? (_jsxs("div", { className: "text-center py-12", children: [_jsx(AlertCircle, { className: "w-12 h-12 text-gray-400 mx-auto mb-3" }), _jsx("p", { className: "text-gray-600 font-medium", children: "No matching photos found" }), _jsx("p", { className: "text-sm text-gray-500 mt-1", children: "Try a different photo with better lighting" }), _jsx("button", { onClick: () => {
                                                setStep('selfie');
                                                setSelfiePreview(null);
                                                setSelfieFile(null);
                                            }, className: "mt-4 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition", children: "Try Again" })] })) : (_jsxs(_Fragment, { children: [_jsxs("p", { className: "text-gray-600 mb-6", children: ["Found ", _jsxs("strong", { children: [matchedPhotos.length, " photos"] }), " matching you!"] }), _jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4", children: matchedPhotos.map(photo => (_jsxs("div", { className: "bg-white rounded-lg overflow-hidden border-2 border-gray-200 hover:border-purple-400 transition", children: [_jsxs("div", { className: "relative aspect-square bg-gray-100 overflow-hidden group", children: [_jsx("img", { src: photo.url, alt: "Matched photo", className: "w-full h-full object-cover group-hover:scale-105 transition-transform" }), _jsxs("div", { className: "absolute top-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded", children: [Math.round(photo.similarity_score * 100), "% match"] }), _jsx("button", { onClick: () => toggleFavorite(photo.id), className: `absolute top-2 left-2 p-2 rounded-full transition ${favorites.has(photo.id)
                                                                    ? 'bg-red-500 text-white'
                                                                    : 'bg-white text-gray-600 hover:bg-red-100'}`, children: _jsx(Heart, { className: "w-5 h-5", fill: favorites.has(photo.id) ? 'currentColor' : 'none' }) })] }), _jsxs("div", { className: "p-4 space-y-3", children: [_jsxs("div", { className: "flex gap-2", children: [_jsxs("button", { onClick: () => downloadPhoto(photo.url, photo.id), className: "flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg flex items-center justify-center gap-1 transition text-sm font-medium", children: [_jsx(Download, { className: "w-4 h-4" }), "Download"] }), _jsxs("a", { href: `https://wa.me/?text=Check%20out%20this%20wedding%20photo%20${encodeURIComponent(photo.url)}`, target: "_blank", rel: "noreferrer", className: "flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg flex items-center justify-center gap-1 transition text-sm font-medium", children: [_jsx(Share2, { className: "w-4 h-4" }), "Share"] })] }), _jsx("p", { className: "text-xs text-gray-500 text-center", children: new Date(photo.uploaded_at).toLocaleDateString() })] })] }, photo.id))) }), _jsx("div", { className: "mt-8 pt-6 border-t border-gray-200", children: _jsx("button", { onClick: () => {
                                                    setStep('selfie');
                                                    setSelfiePreview(null);
                                                    setSelfieFile(null);
                                                }, className: "w-full py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition font-semibold", children: "Find More Photos" }) })] }))] }) }))] })] }));
}
