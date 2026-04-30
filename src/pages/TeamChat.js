import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../store/authStore';
import { useGuestStore } from '../store/guestStore';
import { Send, MessageCircle } from 'lucide-react';
import { toast } from 'sonner';
export default function TeamChat() {
    const { user } = useAuthStore();
    const guests = useGuestStore((state) => state.guests);
    const [messages, setMessages] = useState([]);
    const [messageText, setMessageText] = useState('');
    const [loading, setLoading] = useState(true);
    const messagesEndRef = useRef(null);
    useEffect(() => {
        loadMessages();
        const interval = setInterval(loadMessages, 3000);
        return () => clearInterval(interval);
    }, []);
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);
    const loadMessages = async () => {
        try {
            const { data, error } = await supabase
                .from('chat_messages')
                .select('*')
                .order('created_at', { ascending: true })
                .limit(100);
            if (error)
                throw error;
            setMessages(data || []);
        }
        catch (error) {
            console.error('Error loading messages:', error);
        }
        finally {
            setLoading(false);
        }
    };
    const handleSendMessage = async () => {
        if (!messageText.trim())
            return;
        const mentions = extractMentions(messageText);
        try {
            const { error } = await supabase
                .from('chat_messages')
                .insert([
                {
                    sender_id: user?.id,
                    sender_name: user?.email?.split('@')[0] || 'Unknown',
                    message: messageText,
                    mentions: mentions
                }
            ]);
            if (error)
                throw error;
            setMessageText('');
            loadMessages();
            toast.success('Message sent');
        }
        catch (error) {
            console.error('Error sending message:', error);
            toast.error('Failed to send message');
        }
    };
    const extractMentions = (text) => {
        const regex = /@(\w+)/g;
        const matches = text.match(regex) || [];
        return matches.map(m => m.substring(1));
    };
    if (loading) {
        return _jsx("div", { className: "flex items-center justify-center h-screen", children: _jsx("p", { children: "Loading chat..." }) });
    }
    return (_jsxs("div", { className: "flex flex-col h-screen bg-gray-50", children: [_jsxs("div", { className: "bg-white border-b border-gray-200 p-6 shadow-sm", children: [_jsxs("h1", { className: "text-3xl font-bold text-gray-800 flex items-center gap-2", children: [_jsx(MessageCircle, { className: "w-8 h-8 text-rose-gold" }), "Team Chat"] }), _jsx("p", { className: "text-gray-600 mt-2", children: "Collaborate with your wedding team. Use @name to mention someone." })] }), _jsxs("div", { className: "flex-1 overflow-y-auto p-6 space-y-4", children: [messages.length === 0 ? (_jsxs("div", { className: "text-center py-12", children: [_jsx(MessageCircle, { className: "w-12 h-12 text-gray-300 mx-auto mb-3" }), _jsx("p", { className: "text-gray-600", children: "No messages yet. Start the conversation!" })] })) : (messages.map(msg => (_jsxs("div", { className: "bg-white rounded-lg p-4 shadow-sm border border-gray-200", children: [_jsxs("div", { className: "flex items-start justify-between mb-2", children: [_jsx("p", { className: "font-semibold text-gray-800", children: msg.sender_name }), _jsx("p", { className: "text-xs text-gray-500", children: new Date(msg.created_at).toLocaleTimeString() })] }), _jsx("p", { className: "text-gray-700", children: msg.message }), msg.mentions.length > 0 && (_jsx("div", { className: "mt-2 flex flex-wrap gap-1", children: msg.mentions.map(mention => (_jsxs("span", { className: "inline-block bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded", children: ["@", mention] }, mention))) }))] }, msg.id)))), _jsx("div", { ref: messagesEndRef })] }), _jsxs("div", { className: "bg-white border-t border-gray-200 p-6", children: [_jsxs("div", { className: "flex gap-3", children: [_jsx("input", { type: "text", value: messageText, onChange: (e) => setMessageText(e.target.value), onKeyPress: (e) => e.key === 'Enter' && handleSendMessage(), placeholder: "Type message... use @name to mention", className: "flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-gold outline-none" }), _jsxs("button", { onClick: handleSendMessage, disabled: !messageText.trim(), className: "bg-rose-gold hover:bg-rose-gold/90 text-white px-6 py-3 rounded-lg transition disabled:opacity-50 flex items-center gap-2", children: [_jsx(Send, { className: "w-5 h-5" }), "Send"] })] }), _jsx("p", { className: "text-xs text-gray-500 mt-2", children: "\uD83D\uDCA1 Tip: Type @name to mention team members" })] })] }));
}
