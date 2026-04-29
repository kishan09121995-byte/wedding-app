import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { useGuestStore } from '../store/guestStore';
import { supabase } from '../lib/supabase';
import { Upload, Download, Share2, X } from 'lucide-react';
import { toast } from 'sonner';
import QRCode from 'qrcode.react';
export default function PhotoGallery() {
    const guests = useGuestStore((state) => state.guests);
    const [photos, setPhotos] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [loading, setLoading] = useState(true);
    const [selectedGuests, setSelectedGuests] = useState({});
    const [filterGuest, setFilterGuest] = useState(null);
    useEffect(() => {
        const loadPhotos = async () => {
            const { data, error } = await supabase.from('photos').select('*').order('uploaded_at', { ascending: false });
            if (error)
                console.error('Error loading photos:', error);
            if (data)
                setPhotos(data);
            setLoading(false);
        };
        loadPhotos();
    }, []);
    const handleFileUpload = async (files) => {
        if (!files)
            return;
        setUploading(true);
        const BACKEND_URL = 'https://wedding-gallery-backend-with-ai-photo-matching-production.up.railway.app';
        for (const file of Array.from(files)) {
            const formData = new FormData();
            formData.append('photo', file);
            try {
                const res = await fetch(`${BACKEND_URL}/api/upload-photo`, {
                    method: 'POST',
                    body: formData,
                });
                const data = await res.json();
                if (data.downloadUrl) {
                    const { data: photoData, error } = await supabase
                        .from('photos')
                        .insert([{ url: data.downloadUrl, guest_tags: [] }])
                        .select();
                    if (error) {
                        toast.error(`Failed to save ${file.name}`);
                    }
                    else if (photoData) {
                        setPhotos((prev) => [photoData[0], ...prev]);
                        toast.success(`${file.name} uploaded`);
                    }
                }
            }
            catch (error) {
                console.error('Upload error:', error);
                toast.error(`Failed to upload ${file.name}`);
            }
        }
        setUploading(false);
    };
    const handleTagPhoto = async (photoId, guestId) => {
        if (!guestId)
            return;
        const currentTags = photos.find((p) => p.id === photoId)?.guest_tags || [];
        const newTags = currentTags.includes(guestId)
            ? currentTags.filter((t) => t !== guestId)
            : [...currentTags, guestId];
        const { error } = await supabase
            .from('photos')
            .update({ guest_tags: newTags })
            .eq('id', photoId);
        if (error) {
            toast.error('Failed to tag photo');
        }
        else {
            setPhotos((prev) => prev.map((p) => (p.id === photoId ? { ...p, guest_tags: newTags } : p)));
            toast.success('Guest tagged');
        }
        setSelectedGuests((prev) => ({
            ...prev,
            [photoId]: null,
        }));
    };
    const handleDeletePhoto = async (photoId) => {
        if (!confirm('Delete this photo?'))
            return;
        const { error } = await supabase.from('photos').delete().eq('id', photoId);
        if (error) {
            toast.error('Failed to delete photo');
        }
        else {
            setPhotos((prev) => prev.filter((p) => p.id !== photoId));
            toast.success('Photo deleted');
        }
    };
    const displayPhotos = filterGuest
        ? photos.filter((p) => p.guest_tags.includes(filterGuest))
        : photos;
    if (loading)
        return _jsx("div", { className: "p-6", children: "Loading..." });
    return (_jsxs("div", { className: "space-y-6", children: [_jsx("div", { className: "flex justify-between items-start", children: _jsxs("div", { children: [_jsx("h1", { className: "text-2xl font-bold text-gray-900", children: "Photo Gallery" }), _jsx("p", { className: "text-gray-600 text-sm mt-1", children: "Upload and tag wedding photos with guests" })] }) }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [_jsxs("div", { className: "bg-white border border-gray-200 rounded-lg p-6", children: [_jsx("h2", { className: "text-lg font-semibold text-gray-900 mb-4", children: "Upload Photos" }), _jsx("label", { className: "block", children: _jsxs("div", { className: "border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:bg-gray-50 transition-colors", children: [_jsx("input", { type: "file", multiple: true, accept: "image/*", onChange: (e) => handleFileUpload(e.target.files), disabled: uploading, className: "hidden" }), _jsx(Upload, { className: "w-8 h-8 text-gray-400 mx-auto mb-2" }), _jsx("p", { className: "text-gray-700 font-medium text-sm", children: uploading ? 'Uploading...' : 'Click or drag photos' }), _jsx("p", { className: "text-gray-500 text-xs mt-1", children: "JPG, PNG up to 10MB" })] }) }), _jsxs("p", { className: "text-xs text-gray-500 mt-4", children: ["Total photos: ", photos.length] })] }), _jsxs("div", { className: "bg-white border border-gray-200 rounded-lg p-6", children: [_jsx("h2", { className: "text-lg font-semibold text-gray-900 mb-4", children: "Guest Registration" }), _jsxs("div", { className: "bg-gray-50 rounded-lg p-6 text-center", children: [_jsx("p", { className: "text-xs text-gray-600 mb-3", children: "Scan to tag yourself in photos" }), _jsx("div", { className: "flex justify-center", children: _jsx(QRCode, { value: `${window.location.origin}/gallery`, size: 200, level: "H", includeMargin: true }) }), _jsx("p", { className: "text-xs text-gray-500 mt-4", children: "Guests can scan to be tagged in photos" })] })] })] }), _jsxs("div", { className: "bg-white border border-gray-200 rounded-lg p-4", children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Filter by Guest" }), _jsxs("select", { value: filterGuest || '', onChange: (e) => setFilterGuest(e.target.value || null), className: "w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent", children: [_jsxs("option", { value: "", children: ["All Photos (", photos.length, ")"] }), guests.map((g) => {
                                const count = photos.filter((p) => p.guest_tags.includes(g.id)).length;
                                return (_jsxs("option", { value: g.id, children: [g.name, " (", count, ")"] }, g.id));
                            })] })] }), _jsxs("div", { children: [_jsx("h2", { className: "text-lg font-semibold text-gray-900 mb-4", children: filterGuest ? `${guests.find((g) => g.id === filterGuest)?.name}'s Photos` : 'All Photos' }), displayPhotos.length === 0 ? (_jsx("div", { className: "text-center py-12 bg-gray-50 rounded-lg border border-gray-200", children: _jsx("p", { className: "text-gray-600", children: "No photos yet" }) })) : (_jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4", children: displayPhotos.map((photo) => (_jsxs("div", { className: "bg-white border border-gray-200 rounded-lg overflow-hidden", children: [_jsxs("div", { className: "relative aspect-square bg-gray-100 overflow-hidden group", children: [_jsx("img", { src: photo.url, alt: "Wedding photo", className: "w-full h-full object-cover group-hover:opacity-90 transition-opacity" }), _jsx("div", { className: "absolute top-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded", children: new Date(photo.uploaded_at).toLocaleDateString() }), _jsx("button", { onClick: () => handleDeletePhoto(photo.id), className: "absolute top-2 left-2 p-1 bg-red-600 text-white rounded hover:bg-red-700 opacity-0 group-hover:opacity-100 transition-opacity", title: "Delete", children: _jsx(X, { className: "w-4 h-4" }) })] }), _jsxs("div", { className: "p-4 space-y-3", children: [photo.guest_tags.length > 0 && (_jsx("div", { className: "flex flex-wrap gap-2", children: photo.guest_tags.map((tagId) => {
                                                const guest = guests.find((g) => g.id === tagId);
                                                return guest ? (_jsxs("span", { className: "inline-flex items-center gap-1 bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded", children: [guest.name, _jsx("button", { onClick: () => handleTagPhoto(photo.id, tagId), className: "hover:text-blue-600", children: _jsx(X, { className: "w-3 h-3" }) })] }, tagId)) : null;
                                            }) })), _jsxs("select", { value: selectedGuests[photo.id] || '', onChange: (e) => {
                                                const guestId = e.target.value;
                                                if (guestId) {
                                                    handleTagPhoto(photo.id, guestId);
                                                }
                                            }, className: "w-full px-3 py-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent", children: [_jsx("option", { value: "", children: "Tag a guest..." }), guests.map((g) => (_jsx("option", { value: g.id, children: g.name }, g.id)))] }), _jsxs("div", { className: "flex gap-2", children: [_jsxs("a", { href: photo.url, download: true, className: "flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded text-gray-700 text-sm transition-colors", title: "Download", children: [_jsx(Download, { className: "w-4 h-4" }), "Download"] }), _jsxs("a", { href: `https://wa.me/?text=Check%20out%20this%20wedding%20photo%20${encodeURIComponent(photo.url)}`, target: "_blank", rel: "noreferrer", className: "flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-green-100 hover:bg-green-200 rounded text-green-700 text-sm transition-colors", title: "Share on WhatsApp", children: [_jsx(Share2, { className: "w-4 h-4" }), "Share"] })] })] })] }, photo.id))) }))] })] }));
}
