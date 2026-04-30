import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../store/authStore';
import { Send, MessageCircle, X, Minimize2, Maximize2 } from 'lucide-react';
import { toast } from 'sonner';
export default function GlobalChat() {
    const { user } = useAuthStore();
    const [isOpen, setIsOpen] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);
    useEffect(() => {
        if (isOpen && !isMinimized) {
            loadMessages();
        }
    }, [isOpen, isMinimized]);
    useEffect(() => {
        if (isOpen && !isMinimized) {
            scrollToBottom();
        }
    }, [messages]);
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };
    const loadMessages = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('chat_messages')
                .select('*')
                .eq('assignment_id', 0)
                .order('created_at', { ascending: true })
                .limit(50);
            if (error)
                throw error;
            setMessages(data || []);
        }
        catch (err) {
            console.error('Error loading messages:', err.message);
        }
        finally {
            setLoading(false);
        }
    };
    const handleSendMessage = async () => {
        if (!newMessage.trim())
            return;
        try {
            const { error } = await supabase
                .from('chat_messages')
                .insert([
                {
                    assignment_id: 0,
                    sender: user?.email?.split('@')[0] || 'User',
                    message: newMessage,
                },
            ]);
            if (error)
                throw error;
            setNewMessage('');
            loadMessages();
            toast.success('Message sent');
        }
        catch (err) {
            toast.error(err.message);
        }
    };
    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };
    return (_jsxs(_Fragment, { children: [_jsx("button", { onClick: () => setIsOpen(!isOpen), className: "fixed bottom-6 right-6 w-14 h-14 bg-rose-gold hover:bg-rose-gold/90 text-white rounded-full shadow-lg flex items-center justify-center transition z-40", title: "Open chat", children: _jsx(MessageCircle, { className: "w-6 h-6" }) }), isOpen && (_jsxs("div", { className: `fixed bottom-24 right-6 w-80 bg-white rounded-lg shadow-2xl border border-gray-200 flex flex-col transition-all z-50 ${isMinimized ? 'h-12' : 'h-96'}`, children: [_jsxs("div", { className: "p-4 border-b border-gray-200 bg-rose-gold text-white flex items-center justify-between", children: [_jsx("h3", { className: "font-semibold text-sm", children: "Team Chat" }), _jsxs("div", { className: "flex gap-2", children: [_jsx("button", { onClick: () => setIsMinimized(!isMinimized), className: "p-1 hover:bg-rose-gold/80 rounded", children: isMinimized ? (_jsx(Maximize2, { className: "w-4 h-4" })) : (_jsx(Minimize2, { className: "w-4 h-4" })) }), _jsx("button", { onClick: () => setIsOpen(false), className: "p-1 hover:bg-rose-gold/80 rounded", children: _jsx(X, { className: "w-4 h-4" }) })] })] }), !isMinimized && (_jsxs(_Fragment, { children: [_jsxs("div", { className: "flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50", children: [loading ? (_jsx("div", { className: "text-center text-gray-500 text-sm", children: "Loading..." })) : messages.length === 0 ? (_jsx("div", { className: "text-center text-gray-500 text-sm", children: "No messages yet. Start chatting!" })) : (messages.map((msg) => (_jsx("div", { className: `flex ${msg.sender === user?.email?.split('@')[0]
                                            ? 'justify-end'
                                            : 'justify-start'}`, children: _jsxs("div", { className: `max-w-xs px-3 py-2 rounded text-sm ${msg.sender === user?.email?.split('@')[0]
                                                ? 'bg-rose-gold text-white'
                                                : 'bg-white border border-gray-200'}`, children: [_jsx("p", { className: "font-semibold text-xs mb-1", children: msg.sender }), _jsx("p", { className: "break-words", children: msg.message })] }) }, msg.id)))), _jsx("div", { ref: messagesEndRef })] }), _jsxs("div", { className: "p-3 border-t border-gray-200 flex gap-2", children: [_jsx("input", { type: "text", value: newMessage, onChange: (e) => setNewMessage(e.target.value), onKeyDown: handleKeyDown, placeholder: "Type message...", className: "flex-1 px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-rose-gold focus:border-transparent" }), _jsx("button", { onClick: handleSendMessage, disabled: !newMessage.trim(), className: "px-3 py-1 bg-rose-gold hover:bg-rose-gold/90 disabled:opacity-50 text-white rounded text-sm transition", children: _jsx(Send, { className: "w-4 h-4" }) })] })] }))] }))] }));
}
