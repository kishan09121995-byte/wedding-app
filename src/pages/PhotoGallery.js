import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { useGuestStore } from '../store/guestStore';
import { supabase } from '../lib/supabase';
import { Download, Image, RefreshCw, X, Share2, TrendingUp, Users, BarChart3 } from 'lucide-react';
import { toast } from 'sonner';
export default function PhotoGallery() {
    const guests = useGuestStore((state) => state.guests);
    const [photos, setPhotos] = useState([]);
    const [scanning, setScanning] = useState(false);
    const [loading, setLoading] = useState(true);
    const [filterGuest, setFilterGuest] = useState(null);
    const [activeTab, setActiveTab] = useState('gallery');
    const [interactions, setInteractions] = useState([]);
    useEffect(() => {
        const loadPhotos = async () => {
            const { data, error } = await supabase.from('photos').select('*').order('uploaded_at', { ascending: false });
            if (error)
                console.error('Error loading photos:', error);
            if (data)
                setPhotos(data);
            setLoading(false);
        };
        const loadInteractions = async () => {
            const { data, error } = await supabase
                .from('guest_interactions')
                .select('*')
                .order('visited_at', { ascending: false });
            if (error)
                console.error('Error loading interactions:', error);
            if (data)
                setInteractions(data);
        };
        loadPhotos();
        loadInteractions();
    }, []);
    const handleScanGoogleDrive = async () => {
        setScanning(true);
        try {
            const BACKEND_URL = 'https://wedding-gallery-backend-with-ai-photo-matching-production.up.railway.app';
            const res = await fetch(`${BACKEND_URL}/api/scan-drive`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
            });
            if (!res.ok)
                throw new Error('Failed to scan Google Drive');
            const data = await res.json();
            toast.success(`✅ Scanned and indexed ${data.processed || 0} photos from Google Drive`);
            // Reload photos after scan
            const { data: photoData } = await supabase.from('photos').select('*').order('uploaded_at', { ascending: false });
            if (photoData)
                setPhotos(photoData);
        }
        catch (error) {
            console.error('Scan error:', error);
            toast.error('Failed to scan Google Drive. Make sure backend is deployed.');
        }
        finally {
            setScanning(false);
        }
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
    const totalGuestVisits = interactions.length;
    const uniqueGuests = new Set(interactions.map(i => i.phone)).size;
    const avgPhotosPerGuest = totalGuestVisits > 0 ? Math.round(interactions.reduce((sum, i) => sum + i.photos_viewed, 0) / uniqueGuests) : 0;
    const totalFavorites = interactions.reduce((sum, i) => sum + i.favorites_count, 0);
    return (_jsxs("div", { className: "space-y-6", children: [_jsx("div", { className: "flex justify-between items-center", children: _jsxs("div", { children: [_jsxs("h1", { className: "text-3xl font-bold text-gray-900 flex items-center gap-2", children: [_jsx(Image, { className: "w-8 h-8 text-rose-gold" }), "Photo Gallery"] }), _jsx("p", { className: "text-gray-600 text-sm mt-2", children: "Wedding photos with guest management & analytics" })] }) }), _jsxs("div", { className: "flex gap-2 border-b border-gray-200", children: [_jsxs("button", { onClick: () => setActiveTab('gallery'), className: `px-4 py-3 font-medium flex items-center gap-2 border-b-2 transition ${activeTab === 'gallery'
                            ? 'border-blue-600 text-blue-600'
                            : 'border-transparent text-gray-600 hover:text-gray-900'}`, children: [_jsx(Image, { className: "w-4 h-4" }), "Gallery"] }), _jsxs("button", { onClick: () => setActiveTab('dashboard'), className: `px-4 py-3 font-medium flex items-center gap-2 border-b-2 transition ${activeTab === 'dashboard'
                            ? 'border-blue-600 text-blue-600'
                            : 'border-transparent text-gray-600 hover:text-gray-900'}`, children: [_jsx(BarChart3, { className: "w-4 h-4" }), "Creator Dashboard"] })] }), activeTab === 'gallery' && (_jsxs(_Fragment, { children: [_jsx("div", { className: "flex gap-3", children: _jsxs("button", { onClick: handleScanGoogleDrive, disabled: scanning, className: "bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition", children: [_jsx(RefreshCw, { className: `w-5 h-5 ${scanning ? 'animate-spin' : ''}` }), scanning ? 'Scanning Google Drive...' : 'Sync Google Drive Photos'] }) }), _jsxs("div", { className: "bg-blue-50 border border-blue-200 rounded-lg p-4", children: [_jsxs("p", { className: "text-sm text-blue-800", children: ["\uD83D\uDCF8 ", _jsx("strong", { children: "Total Photos:" }), " ", photos.length, " photos indexed from Google Drive"] }), _jsx("p", { className: "text-xs text-blue-600 mt-2", children: "Click \"Sync Google Drive Photos\" to scan and index wedding photos from your Google Drive folder." })] })] })), activeTab === 'dashboard' && (_jsxs(_Fragment, { children: [_jsxs("div", { className: "grid grid-cols-1 md:grid-cols-4 gap-4", children: [_jsx("div", { className: "bg-white border border-gray-200 rounded-lg p-6 shadow-sm", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("p", { className: "text-gray-600 text-sm font-medium", children: "Total Guest Visits" }), _jsx("p", { className: "text-3xl font-bold text-gray-900 mt-2", children: totalGuestVisits })] }), _jsx(Users, { className: "w-8 h-8 text-blue-500 opacity-20" })] }) }), _jsx("div", { className: "bg-white border border-gray-200 rounded-lg p-6 shadow-sm", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("p", { className: "text-gray-600 text-sm font-medium", children: "Unique Guests" }), _jsx("p", { className: "text-3xl font-bold text-gray-900 mt-2", children: uniqueGuests })] }), _jsx(TrendingUp, { className: "w-8 h-8 text-green-500 opacity-20" })] }) }), _jsx("div", { className: "bg-white border border-gray-200 rounded-lg p-6 shadow-sm", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("p", { className: "text-gray-600 text-sm font-medium", children: "Avg Photos/Guest" }), _jsx("p", { className: "text-3xl font-bold text-gray-900 mt-2", children: avgPhotosPerGuest })] }), _jsx(Image, { className: "w-8 h-8 text-purple-500 opacity-20" })] }) }), _jsx("div", { className: "bg-white border border-gray-200 rounded-lg p-6 shadow-sm", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("p", { className: "text-gray-600 text-sm font-medium", children: "Total Favorites" }), _jsx("p", { className: "text-3xl font-bold text-gray-900 mt-2", children: totalFavorites })] }), _jsx(Share2, { className: "w-8 h-8 text-red-500 opacity-20" })] }) })] }), _jsxs("div", { className: "bg-white border border-gray-200 rounded-lg overflow-hidden", children: [_jsx("div", { className: "px-6 py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white", children: _jsxs("h2", { className: "text-lg font-bold flex items-center gap-2", children: [_jsx(Users, { className: "w-5 h-5" }), "Guest Interactions & CRM"] }) }), interactions.length === 0 ? (_jsx("div", { className: "p-8 text-center text-gray-600", children: _jsx("p", { children: "No guest interactions yet" }) })) : (_jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "w-full", children: [_jsx("thead", { className: "bg-gray-50 border-b border-gray-200", children: _jsxs("tr", { children: [_jsx("th", { className: "px-6 py-3 text-left text-sm font-semibold text-gray-700", children: "Guest Name" }), _jsx("th", { className: "px-6 py-3 text-left text-sm font-semibold text-gray-700", children: "Phone" }), _jsx("th", { className: "px-6 py-3 text-left text-sm font-semibold text-gray-700", children: "Email" }), _jsx("th", { className: "px-6 py-3 text-left text-sm font-semibold text-gray-700", children: "Photos Viewed" }), _jsx("th", { className: "px-6 py-3 text-left text-sm font-semibold text-gray-700", children: "Favorites" }), _jsx("th", { className: "px-6 py-3 text-left text-sm font-semibold text-gray-700", children: "Last Visit" })] }) }), _jsx("tbody", { className: "divide-y divide-gray-200", children: interactions.map((interaction, idx) => (_jsxs("tr", { className: "hover:bg-gray-50", children: [_jsx("td", { className: "px-6 py-4 text-sm font-medium text-gray-900", children: interaction.guest_name }), _jsx("td", { className: "px-6 py-4 text-sm text-gray-600", children: interaction.phone }), _jsx("td", { className: "px-6 py-4 text-sm text-gray-600", children: interaction.email || '-' }), _jsx("td", { className: "px-6 py-4 text-sm text-gray-900 font-semibold", children: interaction.photos_viewed }), _jsxs("td", { className: "px-6 py-4 text-sm text-gray-900 font-semibold text-red-600", children: ["\u2764\uFE0F ", interaction.favorites_count] }), _jsx("td", { className: "px-6 py-4 text-sm text-gray-600", children: new Date(interaction.visited_at).toLocaleDateString() })] }, idx))) })] }) }))] }), _jsx("div", { className: "bg-green-50 border border-green-200 rounded-lg p-4", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("p", { className: "font-semibold text-green-900", children: "\uD83D\uDCCA Export Guest Data" }), _jsx("p", { className: "text-sm text-green-700 mt-1", children: "Download all guest interactions and engagement metrics for CRM or analysis" })] }), _jsx("button", { className: "px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition", children: "Export to Excel" })] }) })] })), activeTab === 'gallery' && (_jsxs("div", { className: "bg-white border border-gray-200 rounded-lg p-4", children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Filter by Guest" }), _jsxs("select", { value: filterGuest || '', onChange: (e) => setFilterGuest(e.target.value || null), className: "w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent", children: [_jsxs("option", { value: "", children: ["All Photos (", photos.length, ")"] }), guests.map((g) => {
                                const count = photos.filter((p) => p.guest_tags.includes(g.id)).length;
                                return (_jsxs("option", { value: g.id, children: [g.name, " (", count, ")"] }, g.id));
                            })] })] })), activeTab === 'gallery' && (_jsxs("div", { children: [_jsx("h2", { className: "text-lg font-semibold text-gray-900 mb-4", children: filterGuest ? `${guests.find((g) => g.id === filterGuest)?.name}'s Photos` : 'All Photos' }), displayPhotos.length === 0 ? (_jsx("div", { className: "text-center py-12 bg-gray-50 rounded-lg border border-gray-200", children: _jsx("p", { className: "text-gray-600", children: "No photos yet" }) })) : (_jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4", children: displayPhotos.map((photo) => (_jsxs("div", { className: "bg-white border border-gray-200 rounded-lg overflow-hidden", children: [_jsxs("div", { className: "relative aspect-square bg-gray-100 overflow-hidden group", children: [_jsx("img", { src: photo.url, alt: "Wedding photo", className: "w-full h-full object-cover group-hover:opacity-90 transition-opacity" }), _jsx("div", { className: "absolute top-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded", children: new Date(photo.uploaded_at).toLocaleDateString() }), _jsx("button", { onClick: () => handleDeletePhoto(photo.id), className: "absolute top-2 left-2 p-1 bg-red-600 text-white rounded hover:bg-red-700 opacity-0 group-hover:opacity-100 transition-opacity", title: "Delete", children: _jsx(X, { className: "w-4 h-4" }) })] }), _jsxs("div", { className: "p-4 space-y-3", children: [photo.guest_tags.length > 0 && (_jsx("div", { className: "flex flex-wrap gap-2", children: photo.guest_tags.map((tagId) => {
                                                const guest = guests.find((g) => g.id === tagId);
                                                return guest ? (_jsxs("span", { className: "inline-flex items-center gap-1 bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded", children: [guest.name, _jsx("button", { onClick: () => handleTagPhoto(photo.id, tagId), className: "hover:text-blue-600", children: _jsx(X, { className: "w-3 h-3" }) })] }, tagId)) : null;
                                            }) })), _jsxs("select", { defaultValue: "", onChange: (e) => {
                                                const guestId = e.target.value;
                                                if (guestId) {
                                                    handleTagPhoto(photo.id, guestId);
                                                }
                                            }, className: "w-full px-3 py-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent", children: [_jsx("option", { value: "", children: "Tag a guest..." }), guests.map((g) => (_jsx("option", { value: g.id, children: g.name }, g.id)))] }), _jsxs("div", { className: "flex gap-2", children: [_jsxs("a", { href: photo.url, download: true, className: "flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded text-gray-700 text-sm transition-colors", title: "Download", children: [_jsx(Download, { className: "w-4 h-4" }), "Download"] }), _jsxs("a", { href: `https://wa.me/?text=Check%20out%20this%20wedding%20photo%20${encodeURIComponent(photo.url)}`, target: "_blank", rel: "noreferrer", className: "flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-green-100 hover:bg-green-200 rounded text-green-700 text-sm transition-colors", title: "Share on WhatsApp", children: [_jsx(Share2, { className: "w-4 h-4" }), "Share"] })] })] })] }, photo.id))) }))] }))] }));
}
