import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../store/authStore';
import { Bell, Check, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
export default function Notifications() {
    const { user } = useAuthStore();
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    useEffect(() => {
        loadNotifications();
        subscribeToNotifications();
    }, [user]);
    const loadNotifications = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('notifications')
                .select('*')
                .eq('user_email', user?.email)
                .order('created_at', { ascending: false });
            if (error)
                throw error;
            setNotifications(data || []);
        }
        catch (err) {
            toast.error(err.message);
        }
        finally {
            setLoading(false);
        }
    };
    const subscribeToNotifications = () => {
        const channel = supabase
            .channel(`notifications:${user?.email}`)
            .on('postgres_changes', {
            event: 'INSERT',
            schema: 'public',
            table: 'notifications',
            filter: `user_email=eq.${user?.email}`,
        }, (payload) => {
            setNotifications((prev) => [payload.new, ...prev]);
            playNotificationSound();
        })
            .subscribe();
        return () => {
            supabase.removeChannel(channel);
        };
    };
    const playNotificationSound = () => {
        const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAAB9AAACABAAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj==');
        audio.play().catch(() => { });
    };
    const handleMarkAsRead = async (id) => {
        try {
            const { error } = await supabase
                .from('notifications')
                .update({ read: true })
                .eq('id', id);
            if (error)
                throw error;
            setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
            toast.success('Marked as read');
        }
        catch (err) {
            toast.error(err.message);
        }
    };
    const handleDelete = async (id) => {
        try {
            const { error } = await supabase
                .from('notifications')
                .delete()
                .eq('id', id);
            if (error)
                throw error;
            setNotifications((prev) => prev.filter((n) => n.id !== id));
            toast.success('Deleted');
        }
        catch (err) {
            toast.error(err.message);
        }
    };
    const handleMarkAllAsRead = async () => {
        try {
            const { error } = await supabase
                .from('notifications')
                .update({ read: true })
                .eq('user_email', user?.email)
                .eq('read', false);
            if (error)
                throw error;
            setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
            toast.success('All marked as read');
        }
        catch (err) {
            toast.error(err.message);
        }
    };
    const filteredNotifications = notifications.filter((n) => filter === 'unread' ? !n.read : true);
    const unreadCount = notifications.filter((n) => !n.read).length;
    const typeColors = {
        assignment: 'bg-blue-100 text-blue-800',
        chat: 'bg-purple-100 text-purple-800',
        arrival: 'bg-green-100 text-green-800',
        event: 'bg-rose-100 text-rose-800',
        general: 'bg-gray-100 text-gray-800',
    };
    const typeIcons = {
        assignment: '📋',
        chat: '💬',
        arrival: '🚗',
        event: '🎉',
        general: '📢',
    };
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "flex justify-between items-start", children: [_jsxs("div", { children: [_jsxs("h2", { className: "text-2xl font-bold text-gray-800 mb-2 flex items-center gap-2", children: [_jsx(Bell, { className: "w-6 h-6 text-rose-gold" }), "Notifications"] }), _jsxs("p", { className: "text-gray-600", children: [unreadCount, " unread notification", unreadCount !== 1 ? 's' : ''] })] }), unreadCount > 0 && (_jsx("button", { onClick: handleMarkAllAsRead, className: "px-4 py-2 bg-rose-gold hover:bg-rose-gold/90 text-white rounded-lg text-sm transition", children: "Mark all as read" }))] }), _jsxs("div", { className: "flex gap-2", children: [_jsxs("button", { onClick: () => setFilter('all'), className: `px-4 py-2 rounded-lg transition text-sm font-medium ${filter === 'all'
                            ? 'bg-rose-gold text-white'
                            : 'bg-gray-200 text-gray-800 hover:bg-gray-300'}`, children: ["All (", notifications.length, ")"] }), _jsxs("button", { onClick: () => setFilter('unread'), className: `px-4 py-2 rounded-lg transition text-sm font-medium ${filter === 'unread'
                            ? 'bg-rose-gold text-white'
                            : 'bg-gray-200 text-gray-800 hover:bg-gray-300'}`, children: ["Unread (", unreadCount, ")"] })] }), _jsx("div", { className: "space-y-3", children: loading ? (_jsx("div", { className: "text-center py-8 text-gray-500", children: "Loading..." })) : filteredNotifications.length === 0 ? (_jsx("div", { className: "text-center py-8 text-gray-500", children: filter === 'unread'
                        ? 'No unread notifications'
                        : 'No notifications yet' })) : (filteredNotifications.map((notification) => (_jsx("div", { className: `p-4 rounded-lg border-l-4 transition ${notification.read
                        ? 'bg-gray-50 border-gray-300'
                        : 'bg-white border-rose-gold shadow-md'}`, children: _jsxs("div", { className: "flex items-start justify-between gap-4", children: [_jsxs("div", { className: "flex-1", children: [_jsxs("div", { className: "flex items-center gap-2 mb-2", children: [_jsx("span", { className: "text-xl", children: typeIcons[notification.type] || '📌' }), _jsx("span", { className: `px-2 py-1 rounded text-xs font-semibold ${typeColors[notification.type] || typeColors.general}`, children: notification.type.charAt(0).toUpperCase() +
                                                    notification.type.slice(1) }), !notification.read && (_jsx("div", { className: "w-2 h-2 bg-rose-gold rounded-full" }))] }), _jsx("h4", { className: "font-semibold text-gray-800 mb-1", children: notification.title }), _jsx("p", { className: "text-gray-600 text-sm mb-2", children: notification.message }), _jsx("p", { className: "text-xs text-gray-500", children: new Date(notification.created_at).toLocaleString() })] }), _jsxs("div", { className: "flex gap-2", children: [!notification.read && (_jsx("button", { onClick: () => handleMarkAsRead(notification.id), className: "p-2 hover:bg-gray-200 rounded-lg transition text-gray-600", title: "Mark as read", children: _jsx(Check, { className: "w-4 h-4" }) })), _jsx("button", { onClick: () => handleDelete(notification.id), className: "p-2 hover:bg-red-100 rounded-lg transition text-red-600", title: "Delete", children: _jsx(Trash2, { className: "w-4 h-4" }) })] })] }) }, notification.id)))) })] }));
}
