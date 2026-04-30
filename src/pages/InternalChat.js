import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../store/authStore';
import { useNotifications } from '../hooks/useNotifications';
import { Send, MessageCircle } from 'lucide-react';
import { toast } from 'sonner';
export default function InternalChat() {
    const { user } = useAuthStore();
    const { sendNotification } = useNotifications();
    const [messages, setMessages] = useState([]);
    const [assignments, setAssignments] = useState([]);
    const [selectedAssignmentId, setSelectedAssignmentId] = useState(null);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const messagesEndRef = useRef(null);
    useEffect(() => {
        loadAssignments();
    }, []);
    useEffect(() => {
        if (selectedAssignmentId) {
            loadMessages();
        }
    }, [selectedAssignmentId]);
    useEffect(() => {
        scrollToBottom();
    }, [messages]);
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };
    const loadAssignments = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('assignments')
                .select('id, responsibility, guest_name:guests(name)')
                .order('created_at', { ascending: false });
            if (error)
                throw error;
            const mapped = data.map((a) => ({
                id: a.id,
                responsibility: a.responsibility,
                guest_name: Array.isArray(a.guest_name) ? a.guest_name[0]?.name : a.guest_name?.name || 'Unknown',
                assigned_to: a.assigned_to || '',
            }));
            setAssignments(mapped);
            if (mapped.length > 0 && !selectedAssignmentId) {
                setSelectedAssignmentId(mapped[0].id);
            }
        }
        catch (err) {
            toast.error(err.message);
        }
        finally {
            setLoading(false);
        }
    };
    const loadMessages = async () => {
        try {
            const { data, error } = await supabase
                .from('chat_messages')
                .select('*')
                .eq('assignment_id', selectedAssignmentId)
                .order('created_at', { ascending: true });
            if (error)
                throw error;
            setMessages(data || []);
        }
        catch (err) {
            toast.error(err.message);
        }
    };
    const handleSendMessage = async () => {
        if (!newMessage.trim() || !selectedAssignmentId)
            return;
        try {
            const { error } = await supabase
                .from('chat_messages')
                .insert([
                {
                    assignment_id: selectedAssignmentId,
                    sender: user?.email?.split('@')[0] || 'User',
                    message: newMessage,
                },
            ]);
            if (error)
                throw error;
            // Send notification to team members
            const assignment = assignments.find((a) => a.id === selectedAssignmentId);
            if (assignment?.assigned_to) {
                const assigneeEmail = `${assignment.assigned_to}@weddingapp.test`;
                await sendNotification(assigneeEmail, '💬 New Message', `${user?.email?.split('@')[0]}: ${newMessage.substring(0, 50)}...`, 'chat', selectedAssignmentId, 'chat');
            }
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
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { children: [_jsxs("h2", { className: "text-2xl font-bold text-gray-800 mb-2 flex items-center gap-2", children: [_jsx(MessageCircle, { className: "w-6 h-6 text-rose-gold" }), "Internal Chat"] }), _jsx("p", { className: "text-gray-600", children: "Team communication linked to responsibilities" })] }), _jsxs("div", { className: "grid grid-cols-4 gap-6 h-[600px]", children: [_jsxs("div", { className: "bg-white rounded-lg shadow border border-gray-200 overflow-hidden flex flex-col", children: [_jsx("div", { className: "p-4 border-b border-gray-200 bg-gray-50", children: _jsx("h3", { className: "font-semibold text-gray-800 text-sm", children: "Tasks" }) }), _jsx("div", { className: "flex-1 overflow-y-auto", children: loading ? (_jsx("div", { className: "p-4 text-center text-gray-500 text-sm", children: "Loading..." })) : assignments.length === 0 ? (_jsx("div", { className: "p-4 text-center text-gray-500 text-sm", children: "No assignments" })) : (assignments.map((a) => (_jsxs("button", { onClick: () => setSelectedAssignmentId(a.id), className: `w-full text-left p-3 border-b border-gray-100 hover:bg-gray-50 transition text-sm ${selectedAssignmentId === a.id
                                        ? 'bg-rose-gold/10 border-l-4 border-rose-gold'
                                        : ''}`, children: [_jsx("p", { className: "font-medium text-gray-800 line-clamp-2", children: a.responsibility }), _jsx("p", { className: "text-xs text-gray-500 mt-1", children: a.guest_name })] }, a.id)))) })] }), _jsx("div", { className: "col-span-3 bg-white rounded-lg shadow border border-gray-200 flex flex-col", children: selectedAssignmentId ? (_jsxs(_Fragment, { children: [_jsxs("div", { className: "flex-1 overflow-y-auto p-4 space-y-4", children: [messages.length === 0 ? (_jsx("div", { className: "flex items-center justify-center h-full text-gray-500", children: _jsx("p", { className: "text-sm", children: "No messages yet. Start the conversation!" }) })) : (messages.map((msg) => (_jsx("div", { className: `flex ${msg.sender === user?.email?.split('@')[0] ? 'justify-end' : 'justify-start'}`, children: _jsxs("div", { className: `max-w-xs px-4 py-2 rounded-lg ${msg.sender === user?.email?.split('@')[0]
                                                    ? 'bg-rose-gold text-white'
                                                    : 'bg-gray-100 text-gray-800'}`, children: [_jsx("p", { className: `text-xs font-semibold mb-1 ${msg.sender === user?.email?.split('@')[0]
                                                            ? 'text-rose-gold/20'
                                                            : 'text-gray-600'}`, children: msg.sender }), _jsx("p", { className: "text-sm break-words", children: msg.message }), _jsx("p", { className: `text-xs mt-1 ${msg.sender === user?.email?.split('@')[0]
                                                            ? 'text-rose-gold/30'
                                                            : 'text-gray-500'}`, children: new Date(msg.created_at).toLocaleTimeString() })] }) }, msg.id)))), _jsx("div", { ref: messagesEndRef })] }), _jsxs("div", { className: "p-4 border-t border-gray-200 flex gap-2", children: [_jsx("textarea", { value: newMessage, onChange: (e) => setNewMessage(e.target.value), onKeyDown: handleKeyDown, placeholder: "Type your message... (Shift+Enter for new line)", className: "flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm resize-none focus:ring-2 focus:ring-rose-gold focus:border-transparent", rows: 3 }), _jsx("button", { onClick: handleSendMessage, disabled: !newMessage.trim(), className: "px-4 py-2 bg-rose-gold hover:bg-rose-gold/90 disabled:opacity-50 text-white rounded-lg transition flex items-center gap-2", children: _jsx(Send, { className: "w-4 h-4" }) })] })] })) : (_jsx("div", { className: "flex items-center justify-center h-full text-gray-500", children: _jsx("p", { children: "Select a task to start chatting" }) })) })] })] }));
}
