import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { useGuestStore } from '../store/guestStore';
import { supabase } from '../lib/supabase';
import { Upload, Download, Trash2, Share2, Filter } from 'lucide-react';
import { toast } from 'sonner';
export default function PhotoGallery() {
    const guests = useGuestStore((state) => state.guests);
    const [photos, setPhotos] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [loading, setLoading] = useState(true);
    const [filterGuest, setFilterGuest] = useState(null);
    const [selectedPhoto, setSelectedPhoto] = useState(null);
    const [selectedGuests, setSelectedGuests] = useState([]);
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
        for (const file of Array.from(files)) {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || 'wedding_app');
            formData.append('cloud_name', import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'demo');
            try {
                const res = await fetch(`https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'demo'}/image/upload`, {
                    method: 'POST',
                    body: formData,
                });
                const data = await res.json();
                if (data.secure_url) {
                    const { data: photoData, error } = await supabase
                        .from('photos')
                        .insert([{ url: data.secure_url, guest_tags: [] }])
                        .select();
                    if (error) {
                        console.error('Error saving photo:', error);
                    }
                    else if (photoData) {
                        setPhotos((prev) => [photoData[0], ...prev]);
                        toast.success(`${file.name} uploaded successfully`);
                    }
                }
            }
            catch (error) {
                console.error('Error uploading to Cloudinary:', error);
                toast.error(`Failed to upload ${file.name}`);
            }
        }
        setUploading(false);
    };
    const handleTagPhoto = async () => {
        if (!selectedPhoto || selectedGuests.length === 0)
            return;
        const { error } = await supabase
            .from('photos')
            .update({ guest_tags: selectedGuests })
            .eq('id', selectedPhoto);
        if (error) {
            toast.error('Failed to tag photo');
            console.error(error);
        }
        else {
            setPhotos((prev) => prev.map((p) => (p.id === selectedPhoto ? { ...p, guest_tags: selectedGuests } : p)));
            setSelectedPhoto(null);
            setSelectedGuests([]);
            toast.success('Photo tagged successfully');
        }
    };
    const handleDeletePhoto = async (photoId) => {
        if (!confirm('Delete this photo?'))
            return;
        const { error } = await supabase.from('photos').delete().eq('id', photoId);
        if (error) {
            toast.error('Failed to delete photo');
            console.error(error);
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
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-2xl font-bold text-gray-800", children: "Photo Gallery" }), _jsx("p", { className: "text-gray-600 text-sm mt-1", children: "Upload, tag, and share wedding photos" })] }), _jsx("div", { className: "bg-white rounded-lg shadow-sm border border-gray-200 p-6", children: _jsx("label", { className: "block", children: _jsxs("div", { className: "border-2 border-dashed border-blue-300 rounded-lg p-8 text-center cursor-pointer hover:bg-blue-50 transition-colors", children: [_jsx("input", { type: "file", multiple: true, accept: "image/*", onChange: (e) => handleFileUpload(e.target.files), disabled: uploading, className: "hidden" }), _jsx(Upload, { className: "w-12 h-12 text-blue-400 mx-auto mb-3" }), _jsx("p", { className: "text-gray-800 font-semibold", children: uploading ? 'Uploading...' : 'Drag photos here or click to upload' }), _jsx("p", { className: "text-gray-600 text-sm mt-1", children: "JPG, PNG up to 10MB each" })] }) }) }), _jsxs("div", { className: "bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Filter by Guest" }), _jsxs("select", { value: filterGuest || '', onChange: (e) => setFilterGuest(e.target.value || null), className: "w-full px-4 py-2 border border-gray-300 rounded-lg text-sm", children: [_jsx("option", { value: "", children: "All Photos" }), guests.map((g) => (_jsx("option", { value: g.id, children: g.name }, g.id)))] })] }), selectedPhoto && (_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Tag Guests" }), _jsxs("div", { className: "space-y-2", children: [_jsx("select", { multiple: true, value: selectedGuests, onChange: (e) => setSelectedGuests(Array.from(e.target.selectedOptions, (o) => o.value)), className: "w-full px-4 py-2 border border-gray-300 rounded-lg text-sm", size: 5, children: guests.map((g) => (_jsx("option", { value: g.id, children: g.name }, g.id))) }), _jsx("p", { className: "text-xs text-gray-600", children: "Hold Ctrl/Cmd to select multiple guests" }), _jsx("button", { onClick: handleTagPhoto, className: "w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium", children: "Save Tags" })] })] }))] }), _jsxs("div", { children: [_jsx("h2", { className: "text-lg font-bold text-gray-800 mb-4", children: filterGuest ? `Photos of ${guests.find((g) => g.id === filterGuest)?.name}` : 'All Photos' }), _jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4", children: displayPhotos.map((photo) => (_jsxs("div", { className: "relative group bg-gray-100 rounded-lg overflow-hidden aspect-square", children: [_jsx("img", { src: photo.url, alt: "Wedding photo", className: "w-full h-full object-cover group-hover:opacity-75 transition-opacity" }), photo.guest_tags.length > 0 && (_jsx("div", { className: "absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-3", children: _jsxs("div", { className: "flex flex-wrap gap-1", children: [photo.guest_tags.slice(0, 2).map((tagId) => {
                                                const guest = guests.find((g) => g.id === tagId);
                                                return guest ? (_jsx("span", { className: "text-xs bg-white text-gray-800 px-2 py-1 rounded-full font-medium", children: guest.name }, tagId)) : null;
                                            }), photo.guest_tags.length > 2 && (_jsxs("span", { className: "text-xs bg-gray-600 text-white px-2 py-1 rounded-full font-medium", children: ["+", photo.guest_tags.length - 2] }))] }) })), _jsxs("div", { className: "absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100", children: [_jsx("button", { onClick: () => {
                                                setSelectedPhoto(photo.id);
                                                setSelectedGuests(photo.guest_tags);
                                            }, className: "p-2 bg-white rounded-lg hover:bg-gray-100 transition-colors", title: "Tag photo", children: _jsx(Filter, { className: "w-5 h-5 text-gray-800" }) }), _jsx("a", { href: photo.url, download: true, className: "p-2 bg-white rounded-lg hover:bg-gray-100 transition-colors", title: "Download", children: _jsx(Download, { className: "w-5 h-5 text-gray-800" }) }), _jsx("a", { href: `https://wa.me/?text=Check%20out%20this%20wedding%20photo%20${encodeURIComponent(photo.url)}`, target: "_blank", rel: "noreferrer", className: "p-2 bg-white rounded-lg hover:bg-gray-100 transition-colors", title: "Share on WhatsApp", children: _jsx(Share2, { className: "w-5 h-5 text-gray-800" }) }), _jsx("button", { onClick: () => handleDeletePhoto(photo.id), className: "p-2 bg-red-600 rounded-lg hover:bg-red-700 transition-colors", title: "Delete", children: _jsx(Trash2, { className: "w-5 h-5 text-white" }) })] }), _jsx("div", { className: "absolute top-2 right-2 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded", children: new Date(photo.uploaded_at).toLocaleDateString() })] }, photo.id))) }), displayPhotos.length === 0 && (_jsx("div", { className: "text-center py-12 bg-gray-50 rounded-lg border border-gray-200", children: _jsx("p", { className: "text-gray-600", children: "No photos found" }) }))] }), _jsxs("div", { className: "bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800", children: [_jsx("p", { className: "font-medium mb-1", children: "\uD83D\uDCF8 Photo Management Tips" }), _jsxs("ul", { className: "list-disc list-inside space-y-1 text-xs", children: [_jsx("li", { children: "Upload photos in bulk by selecting multiple files" }), _jsx("li", { children: "Click a photo to tag guests \u2014 they'll appear in filtered view" }), _jsx("li", { children: "Share photos instantly on WhatsApp with the share button" }), _jsx("li", { children: "Download original quality photos anytime" })] })] })] }));
}
